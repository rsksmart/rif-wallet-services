import { response } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { PriceProvider } from '../service/price/priceProvider'
import { Profiler } from '../service/profiler'

export class WebSocketAPI {
  private server: http.Server
  private rskExplorerApi: RSKExplorerAPI

  constructor (server: http.Server, rskExplorerApi: RSKExplorerAPI) {
    this.server = server
    this.rskExplorerApi = rskExplorerApi
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
        const profiler = new Profiler(address, this.rskExplorerApi)
        profiler.on(address, (data) => {
          console.log(data)
          socket.emit('change', data)
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
