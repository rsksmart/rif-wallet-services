import http from 'http'
import { io } from 'socket.io-client'
import { mockAddress, tokenResponse, transactionResponse } from './mockAddressResponses'
import { LiveController } from '../src/controller/live'
import { Profiler } from '../src/service/profiler'
import { TransactionProvider } from '../src/service/transaction/transactionProvider'
import { PriceProvider } from '../src/service/price/priceProvider'
import { BalanceProvider } from '../src/service/balance/balanceProvider'
import { CoinMarketCapPriceProvider } from '../src/service/price/coinMarketCapPriceProvider'
import { pricesResponse } from './mockPriceResponses'

describe('web socket', () => {
  let serverSocket, clientSocket
  const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
  const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
  const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))

  beforeAll((done) => {
    process.env.DEFAULT_CONVERT_FIAT = 'USD'
    process.env.CHAIN_ID = '30'
    const server = http.createServer()
    const liveController = new LiveController(server)
    const profiler = new Profiler()
    const rskExplorerApiMock = {
      getTransactionsByAddress: getTransactionsByAddressMock,
      getTokensByAddress: getTokensByAddressMock
    }
    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }
    profiler.transactionProvider = new TransactionProvider(rskExplorerApiMock as any)
    const coinMarketCapPriceProvider = new CoinMarketCapPriceProvider(coinMarketCapApiMock as any)
    profiler.priceProvider = new PriceProvider(coinMarketCapPriceProvider, rskExplorerApiMock as any)
    profiler.balanceProvider = new BalanceProvider(rskExplorerApiMock as any)
    liveController.profiler = profiler
    serverSocket = liveController.init()
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
  })

  test('balances', (done) => {
    clientSocket.on('change', (arg) => {
      const { type, payload } = arg
      if (type === 'newBalance') {
        expect(payload).toEqual(tokenResponse[0])
      }
      if (type === 'newTransaction') {
        expect(payload).toEqual(transactionResponse.data[0])
      }
      if (type === 'newPrice') {
        console.log(payload)
        expect(payload).toEqual(pricesResponse)
      }
    })
    clientSocket.emit('subscribe', { address: mockAddress })
    setTimeout(done, 4000)
  })
})
