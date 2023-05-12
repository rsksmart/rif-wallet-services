import { TokenValidationConfig, verifyReceivedJwt } from '@rsksmart/express-did-auth'
import http from 'http'
import log from 'loglevel'
import { Server } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { RSKDatasource, RSKNodeProvider } from '../repository/DataSource'
import { LastPrice } from '../service/price/lastPrice'
import { logger } from '../util/logger'

export class WebSocketAPI {
  private server: http.Server
  // private rskExplorerApi: RSKExplorerAPI
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private providerMapping: RSKNodeProvider

  constructor (server: http.Server, dataSourceMapping: RSKDatasource,
    lastPrice: LastPrice, providerMapping: RSKNodeProvider) {
    this.server = server
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
    this.providerMapping = providerMapping
  }

  init (io: Server, config: TokenValidationConfig) {
    io.on('connection', (socket) => {
      logger.info('new user connected')

      socket.on('subscribe', async ({ address, chainId = '31', accessToken }
        : { address: string, chainId: string, accessToken: string }) => {
        if (!accessToken) {
          socket.emit('error', 'Access token is required')
          return
        }
        const verified = await verifyReceivedJwt(accessToken, config)
        if (verified.issuer !== config.serviceDid) {
          socket.emit('error', 'Invalid access token')
          return
        }
        logger.info('new subscription with address: ', address)
        const dataSource = this.dataSourceMapping[chainId as string]
        if (!dataSource) socket.emit('error', `Can not connect with dataSource for ${chainId}`)
        const provider = this.providerMapping[chainId as string]
        const profiler = new Profiler(address, dataSource!, this.lastPrice, provider)

        profiler.on('balances', (data) => {
          logger.info(data)
          socket.emit('change', data)
        })

        profiler.on('rbtcBalance', (data) => {
          logger.info(data)
          socket.emit('change', data)
        })

        profiler.on('transactions', (data) => {
          logger.info(data)
          socket.emit('change', data)
        })

        profiler.on('prices', (newPrices) => {
          logger.info(newPrices)
          socket.emit('change', newPrices)
        })

        profiler.on('tokenTransfers', (newTokenTranfers) => {
          logger.info(newTokenTranfers)
          socket.emit('change', newTokenTranfers)
        })

        await profiler.subscribe()

        socket.on('disconnect', () => {
          profiler.unsubscribe()
        })
      })
    })

    return io
  }
}
