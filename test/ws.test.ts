import http from 'http'
import { io } from 'socket.io-client'
import { mockAddress, rbtcBalanceResponse, tokenResponse, transactionResponse } from './mockAddressResponses'
import { WebSocketAPI } from '../src/controller/webSocketAPI'
import { pricesResponse } from './mockPriceResponses'
import { LastPrice } from '../src/service/price/lastPrice'
import { PriceCollector } from '../src/service/price/priceCollector'
import { Server } from 'socket.io'

describe('web socket', () => {
  let serverSocket, clientSocket, priceCollector
  const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
  const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
  const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
  const getRbtcBalanceByAddressMock = jest.fn(() => Promise.resolve(rbtcBalanceResponse))

  beforeAll((done) => {
    const server = http.createServer()
    const rskExplorerApiMock = {
      getTransactionsByAddress: getTransactionsByAddressMock,
      getTokensByAddress: getTokensByAddressMock,
      getRbtcBalanceByAddress: getRbtcBalanceByAddressMock
    }
    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }
    const lastPrice = new LastPrice(30)

    priceCollector = new PriceCollector(coinMarketCapApiMock as any, 'USD', 30, 5 * 60 * 1000)

    priceCollector.on('prices', (prices) => {
      lastPrice.save(prices)
    })

    priceCollector.init()
    const webSocketAPI = new WebSocketAPI(server, rskExplorerApiMock as any, lastPrice)
    serverSocket = new Server(server, {
      // cors: {
      //   origin: 'https://amritb.github.io'
      // },
      path: '/ws'
    })
    webSocketAPI.init(serverSocket)
    const port = 3000
    server.listen(port, () => {
      console.log(`RIF Wallet services running on ${port}.`)
    })
    clientSocket = io(`http://localhost:${port}`, {
      path: '/ws'
    })

    clientSocket.on('connect', () => {
      console.log('connected')
      done()
    })
  })

  afterAll(() => {
    serverSocket.close()
    clientSocket.close()
    priceCollector.stop()
  })

  test('events', (done) => {
    clientSocket.on('change', (arg) => {
      const { type, payload } = arg
      if (type === 'newBalance') {
        if (payload.symbol === 'RBTC') {
          expect(payload).toEqual(rbtcBalanceResponse[0])
        } else {
          expect(payload).toEqual(tokenResponse[0])
        }
      }
      if (type === 'newTransaction') {
        expect(payload).toEqual(transactionResponse.data[0])
      }
      if (type === 'newPrice') {
        expect(payload).toEqual(pricesResponse)
      }
    })
    clientSocket.emit('subscribe', { address: mockAddress })
    setTimeout(done, 4000)
  })
})
