import { Server } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { BitcoinDatasource, RSKDatasource, RSKNodeProvider } from '../repository/DataSource'
import { LastPrice } from '../service/price/lastPrice'
import { BtcProfiler } from '../profiler/BtcProfiler'

export class WebSocketAPI {
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private providerMapping: RSKNodeProvider
  private bitcoinMapping: BitcoinDatasource

  constructor (dataSourceMapping: RSKDatasource,
    lastPrice: LastPrice, providerMapping: RSKNodeProvider, bitcoinMapping: BitcoinDatasource) {
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
    this.providerMapping = providerMapping
    this.bitcoinMapping = bitcoinMapping
  }

  init (io: Server) {
    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', async ({ address, chainId = '31' }: { address: string, chainId: string}) => {
        console.log('new subscription with address: ', address)
        const dataSource = this.dataSourceMapping[chainId as string]
        if (!dataSource) socket.emit('error', `Can not connect with dataSource for ${chainId}`)
        const provider = this.providerMapping[chainId as string]
        const profiler = new Profiler(address, dataSource!, this.lastPrice, provider)

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

        await profiler.subscribe()

        socket.on('disconnect', () => {
          profiler.unsubscribe()
        })
      })

      // BITCOIN
      socket.on('subscribe_bitcoin', async ({ xpub, chainId = '31' }) => {
        console.log('new subscription with xpub: ', xpub)
        const dataSource = this.bitcoinMapping[chainId as string]
        if (!dataSource) {
          socket.emit('error', `Can not connect with dataSource for ${chainId}`)
          socket.disconnect()
        }
        if (!xpub) {
          socket.emit('error', 'No xpub received. Please make sure you send a xpub.')
          socket.disconnect()
        }
        const profiler = new BtcProfiler(xpub, dataSource)
        profiler.on('balances', (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        profiler.on('transactions', (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        await profiler.subscribe()
      })
    })

    return io
  }
}
