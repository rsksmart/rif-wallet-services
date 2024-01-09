import { Server } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { BitcoinDatasource, RSKDatasource, RSKNodeProvider } from '../repository/DataSource'
import { LastPrice } from '../service/price/lastPrice'
import { BtcProfiler } from '../profiler/BtcProfiler'
import { AddressService } from '../service/address/AddressService'
import { AddressQuery } from '../api/types'

export class WebSocketAPI {
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private providerMapping: RSKNodeProvider
  private bitcoinMapping: BitcoinDatasource
  private addressService: AddressService

  constructor (dataSourceMapping: RSKDatasource,
    lastPrice: LastPrice, providerMapping: RSKNodeProvider,
    bitcoinMapping: BitcoinDatasource, addressService: AddressService) {
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
    this.providerMapping = providerMapping
    this.bitcoinMapping = bitcoinMapping
    this.addressService = addressService
  }

  init (io: Server) {
    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', async ({ address, chainId = '31', blockNumber = '0' }: AddressQuery) => {
        console.log('new subscription with address: ', address)
        const dataSource = this.dataSourceMapping[chainId as string]
        if (!dataSource) {
          socket.emit('error', `Can not connect with dataSource for ${chainId}`)
          socket.disconnect()
        }
        const provider = this.providerMapping[chainId as string]
        const profiler = new Profiler(address, dataSource, this.lastPrice, provider)

        const data = await this.addressService.getAddressDetails({ chainId, address, blockNumber, limit: '' })
        socket.emit('init', data)

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
