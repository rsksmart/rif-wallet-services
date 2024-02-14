import { Server, Socket } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { BitcoinDatasource, DataSource, RSKDatasource, RSKNodeProvider } from '../repository/DataSource'
import { LastPrice } from '../service/price/lastPrice'
import { BtcProfiler } from '../profiler/BtcProfiler'
import { AddressService } from '../service/address/AddressService'
import { AddressQuery } from '../api/types'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import BitcoinCore from '../service/bitcoin/BitcoinCore'
export class WebSocketAPI {
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private providerMapping: RSKNodeProvider
  private bitcoinMapping: BitcoinDatasource
  private addressService: AddressService
  private tracker = new Map<string, Profiler>()
  private rateLimiter = new RateLimiterMemory(
    {
      points: 10, // requests
      duration: 1, // per second
      blockDuration: 5 * 60
    })

  public constructor (dataSourceMapping: RSKDatasource,
    lastPrice: LastPrice, providerMapping: RSKNodeProvider,
    bitcoinMapping: BitcoinDatasource, addressService: AddressService) {
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
    this.providerMapping = providerMapping
    this.bitcoinMapping = bitcoinMapping
    this.addressService = addressService
  }

  public get trackerKeys () {
    return this.tracker.keys()
  }

  public get trackerValues () {
    return this.tracker.values()
  }

  private async validateRateLimit (socket: Socket) {
    await this.rateLimiter.consume(socket.handshake.address)
  }

  private handleError (socket: Socket, error: any) {
    socket.disconnect()
    console.error('message' in error ? error.message : error)
  }

  private validateParams (dataSource: DataSource | BitcoinCore, chainId: string, socket:Socket, address: string) {
    if (!dataSource) {
      const message = `Can not connect with dataSource for ${chainId}`
      socket.emit('error', message)
      throw new Error(message)
    }
    if (!address) {
      const message = 'No address received. Please make sure you sent it.'
      socket.emit('error', message)
      throw new Error(message)
    }
  }

  public init (io: Server) {
    io.on('connection', (socket) => {
      console.log('new user connected')
      socket.on('subscribe', async ({ address, chainId = '31', blockNumber = '0' }: AddressQuery) => {
        try {
          await this.validateRateLimit(socket)
          console.log('new subscription with address: ', address)
          const dataSource = this.dataSourceMapping[chainId]
          this.validateParams(dataSource, chainId, socket, address)
          const provider = this.providerMapping[chainId as string]
          const key = `${chainId}_${address.toLowerCase()}`
          const profiler = this.tracker.get(key) || new Profiler(address, dataSource, this.lastPrice, provider)
          const newSuscription = this.tracker.has(key)
          this.tracker.set(key, profiler)
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

          if (newSuscription) {
            await profiler.subscribe()
          }

          socket.on('disconnect', () => {
            profiler.unsubscribe()
          })
        } catch (error) {
          this.handleError(socket, error)
        }
      })

      // BITCOIN
      socket.on('subscribe_bitcoin', async ({ xpub, chainId = '31' }) => {
        try {
          await this.validateRateLimit(socket)
          console.log('new subscription with xpub: ', xpub)
          const dataSource = this.bitcoinMapping[chainId as string]
          this.validateParams(dataSource, chainId, socket, xpub)
          const key = `${chainId}_${xpub.toLowerCase()}`
          const profiler = this.tracker.get(key) || new BtcProfiler(xpub, dataSource)
          const newSuscription = this.tracker.has(key)
          profiler.on('balances', (data) => {
            console.log(data)
            socket.emit('change', data)
          })

          profiler.on('transactions', (data) => {
            console.log(data)
            socket.emit('change', data)
          })

          if (newSuscription) {
            await profiler.subscribe()
          }
        } catch (error) {
          this.handleError(socket, error)
        }
      })
    })

    return io
  }
}
