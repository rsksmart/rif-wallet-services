import http from 'http'
import { Server } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { DataSource } from '../repository/DataSource'
import { LastPrice } from '../service/price/lastPrice'

export class WebSocketAPI {
  private server: http.Server
  // private rskExplorerApi: RSKExplorerAPI
  private dataSourceMapping: Map<string, DataSource>
  private lastPrice: LastPrice

  constructor (server: http.Server, dataSourceMapping: Map<string, DataSource>, lastPrice: LastPrice) {
    this.server = server
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
  }

  init (io: Server) {
    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', async ({ address, chainId = '31' }: { address: string, chainId: string }) => {
        console.log('new subscription with address: ', address)
        const dataSource = this.dataSourceMapping.get(chainId)
        if (!dataSource) socket.emit('error', `Can not connect with dataSource for ${chainId}`)
        const profiler = new Profiler(address, dataSource!, this.lastPrice)

        profiler.on('balances', (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        profiler.on('rbtcBalance', (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        profiler.on('transactions', (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        profiler.on('prices', (newPrices) => {
          console.log(newPrices)
          socket.emit('change', newPrices)
        })

        profiler.on('tokenTransfers', (newTokenTranfers) => {
          console.log(newTokenTranfers)
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
