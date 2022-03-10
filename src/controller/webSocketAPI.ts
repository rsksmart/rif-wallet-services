import http from 'http'
import { Server } from 'socket.io'
import { Profiler } from '../profiler/profiler'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { LastPrice } from '../service/price/lastPrice'

export class WebSocketAPI {
  private server: http.Server
  private rskExplorerApi: RSKExplorerAPI
  private lastPrice: LastPrice

  constructor (server: http.Server, rskExplorerApi: RSKExplorerAPI, lastPrice: LastPrice) {
    this.server = server
    this.rskExplorerApi = rskExplorerApi
    this.lastPrice = lastPrice
  }

  init (io: Server) {
    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', async ({ address }: { address: string }) => {
        console.log('new subscription with address: ', address)
        const profiler = new Profiler(address, this.rskExplorerApi, this.lastPrice)

        profiler.on('balances', (data) => {
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
