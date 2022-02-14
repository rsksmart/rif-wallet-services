import http from 'http'
import { Server } from 'socket.io'
import { Profiler } from '../service/profiler'

export class LiveController {
  profiler: Profiler
  private server: http.Server

  constructor (server: http.Server) {
    this.server = server
    this.profiler = Profiler.getInstance()
  }

  init () {
    const io = new Server(this.server, {
      // cors: {
      //   origin: 'https://amritb.github.io'
      // },
      path: '/ws'
    })

    io.on('connection', (socket) => {
      console.log('new user connected')

      socket.on('subscribe', ({ address }: { address: string }) => {
        console.log('new subscription with address: ', address)
        this.profiler.on(address, (data) => {
          socket.emit('change', data)
        })
        this.profiler.subscribe(address)

        socket.on('disconnect', () => {
          this.profiler.unsubscribe(address)
        })
      })
    })
    return io
  }
}
