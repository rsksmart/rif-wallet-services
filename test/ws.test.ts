import http from 'http'
import { io } from 'socket.io-client'
import {
  mockAddress,
  rbtcBalanceResponse,
  tokenResponse,
  transactionResponse,
  eventResponse
} from './mockAddressResponses'
import { WebSocketAPI } from '../src/controller/webSocketAPI'
import { pricesResponse } from './mockPriceResponses'
import { LastPrice } from '../src/service/price/lastPrice'
import { PriceCollector } from '../src/service/price/priceCollector'
import { Server } from 'socket.io'
import { MockProvider } from './MockProvider'

describe('web socket', () => {
  let serverSocket, clientSocket, priceCollector
  const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
  const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
  const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
  const getEventsByAddressMock = jest.fn(() => Promise.resolve(eventResponse))
  const getRbtcBalanceByAddressMock = jest.fn(() => Promise.resolve(rbtcBalanceResponse))
  const getInternalTransactionByAddressMock = jest.fn(() => Promise.resolve([]))

  beforeAll((done) => {
    const server = http.createServer()
    const rskExplorerApiMock = {
      getTransactionsByAddress: getTransactionsByAddressMock,
      getTokensByAddress: getTokensByAddressMock,
      getEventsByAddress: getEventsByAddressMock,
      getRbtcBalanceByAddress: getRbtcBalanceByAddressMock,
      getInternalTransactionByAddress: getInternalTransactionByAddressMock
    }
    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }
    const lastPrice = new LastPrice()
    const mockPrice = {
      getQuotesLatest: jest.fn(() => Promise.resolve({}))
    }

    priceCollector = new PriceCollector([coinMarketCapApiMock as any, mockPrice as any], 'USD', 5 * 60 * 1000)

    priceCollector.on('prices', (prices) => {
      lastPrice.save(prices)
    })

    priceCollector.init()
    const dataSourceMapping = {}
    dataSourceMapping['31'] = rskExplorerApiMock as any
    const providerMapping = {}
    providerMapping['31'] = new MockProvider(31)
    const webSocketAPI = new WebSocketAPI(server, dataSourceMapping, lastPrice, providerMapping)
    serverSocket = new Server(server, {
      // cors: {
      //   origin: 'https://amritb.github.io'
      // },
      path: '/ws'
    })
    const port = 3000
    webSocketAPI.init(serverSocket)
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
      if (type === 'newTokenTransfer') {
        expect(payload).toEqual(eventResponse[0])
      }
    })
    clientSocket.emit('subscribe', { address: mockAddress })
    setTimeout(done, 4000)
  })
})
