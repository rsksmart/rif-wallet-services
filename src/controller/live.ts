import { Application } from "express"
import http from 'http'
import { Profiler } from "../service/profiler"

export class LiveController {

  private server: http.Server
  constructor (server: http.Server) {
    this.server = server
    this.profiler = new Profiler()
  }

  profiler: Profiler

  init() {
    const io = new Server(server, {
      // cors: {
      //   origin: 'https://amritb.github.io'
      // },
      path: '/ws'
    })
    
    io.on('connection', (socket) => {
      console.log('new user connected')
    
      socket.on('subscribe', ({ address }: { address: string }) => {
        console.log('new subscription with address: ', address)
    
        const stopPushingNewBalances = pushNewBalances(socket, rskExplorerApi, address)
        const stopPushingNewTransactions = pushNewTransactions(socket, rskExplorerApi, address)
        const stopPushingNewPrices = pushNewPrices(
          socket,
          rskExplorerApi,
          coinMarketCapApi,
          address,
          environment.DEFAULT_CONVERT_FIAT,
          environment.CHAIN_ID,
          priceCache
        )
    
        socket.on('disconnect', () => {
          stopPushingNewBalances()
          stopPushingNewTransactions()
          stopPushingNewPrices()
        })
      })
    })
  }
}