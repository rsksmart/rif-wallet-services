import http from 'http'
import { Server } from 'socket.io'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { LastPrice } from '../service/price/lastPrice'
import { Profiler } from '../service/profiler'

export class WebSocketAPI {
  private server: http.Server
  private rskExplorerApi: RSKExplorerAPI
  private lastPrice: LastPrice

  constructor (server: http.Server, rskExplorerApi: RSKExplorerAPI, lastPrice: LastPrice) {
    this.server = server
    this.rskExplorerApi = rskExplorerApi
    this.lastPrice = lastPrice
  }

  init () {
    const io = new Server(this.server, {
      cors: {
        origin: 'https://amritb.github.io'
      },
      path: '/ws'
    })

    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', ({ address }: { address: string }) => {
        console.log('new subscription with address: ', address)
        const profiler = new Profiler(address, this.rskExplorerApi, this.lastPrice)

        profiler.on(address, (data) => {
          console.log(data)
          socket.emit('change', data)
        })

        profiler.on('prices', (newPrices) => {
          console.log(newPrices)
          socket.emit('change', newPrices)
        })

        profiler.subscribe()

        socket.on('disconnect', () => {
          profiler.unsubscribe()
        })
      })
    })

    return io
  }
}
