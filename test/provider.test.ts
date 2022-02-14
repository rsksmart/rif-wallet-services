import NodeCache from 'node-cache'
import { BalanceProvider } from '../src/service/balance/balanceProvider'
import { CoinMarketCapPriceProvider } from '../src/service/price/coinMarketCapPriceProvider'
import { PriceCache } from '../src/service/price/priceCache'
import { PriceProvider } from '../src/service/price/priceProvider'
import { TransactionProvider } from '../src/service/transaction/transactionProvider'
import {
  mockAddress, tokenResponse, tokenSecondResponse,
  transactionResponse, transactionSecondResponse
} from './mockAddressResponses'
import { pricesResponse, pricesSecondResponse } from './mockPriceResponses'

let secondTime = false
const getTransactionsByAddressMock = jest.fn(() =>
  Promise.resolve(secondTime ? transactionSecondResponse : transactionResponse)
)
const getQuotesLatestMock = jest.fn(() =>
  Promise.resolve(secondTime ? pricesSecondResponse : pricesResponse)
)
const getTokensByAddressMock = jest.fn(() => Promise.resolve(secondTime ? tokenSecondResponse : tokenResponse))

describe('Emmitting Events', () => {
  test('emit transactions', (done) => {
    const rskExplorerApiMock = {
      getTransactionsByAddress: getTransactionsByAddressMock
    }
    const transactionProvider = new TransactionProvider(rskExplorerApiMock as any)
    transactionProvider.interval = 500
    transactionProvider.on(mockAddress, (data) => {
      const { type, payload } = data
      expect(type).toEqual('newTransaction')
      if (secondTime) {
        expect(payload).toEqual(transactionSecondResponse.data[1])
      } else {
        expect(payload).toEqual(transactionResponse.data[0])
      }
    })
    transactionProvider.subscribe(mockAddress)
    setTimeout(() => {
      secondTime = true
    }, 250)
    setTimeout(() => {
      transactionProvider.unsubscribe(mockAddress)
      secondTime = false
      done()
    }, 1000)
  })

  test('emit balances', (done) => {
    const rskExplorerApiMock = {
      getTokensByAddress: getTokensByAddressMock
    }
    const balanceProvider = new BalanceProvider(rskExplorerApiMock as any)
    balanceProvider.interval = 500
    balanceProvider.on(mockAddress, (data) => {
      const { type, payload } = data
      expect(type).toEqual('newBalance')
      if (secondTime) {
        expect(payload).toEqual(tokenSecondResponse[0])
      } else {
        expect(payload).toEqual(tokenResponse[0])
      }
    })
    balanceProvider.subscribe(mockAddress)
    setTimeout(() => {
      secondTime = true
    }, 250)
    setTimeout(() => {
      balanceProvider.unsubscribe(mockAddress)
      secondTime = false
      done()
    }, 1000)
  })

  test('emit prices', (done) => {
    process.env.CHAIN_ID = '30'
    process.env.DEFAULT_CONVERT_FIAT = 'USD'
    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }
    const rskExplorerApiMock = {
      getTokensByAddress: getTokensByAddressMock
    }
    const cache = new NodeCache()
    const priceCache = new PriceCache(cache)
    const coinMarketCapPriceProvider = new CoinMarketCapPriceProvider(coinMarketCapApiMock as any, priceCache)
    const priceProvider = new PriceProvider(coinMarketCapPriceProvider, rskExplorerApiMock as any)
    priceProvider.interval = 500
    priceProvider.on(mockAddress, (data) => {
      const { type, payload } = data
      expect(type).toEqual('newPrice')
      if (secondTime) {
        expect(payload).toEqual(pricesSecondResponse)
      } else {
        expect(payload).toEqual(pricesResponse)
      }
    })
    priceProvider.subscribe(mockAddress)
    setTimeout(() => {
      secondTime = true
      cache.flushAll()
    }, 250)
    setTimeout(() => {
      priceProvider.unsubscribe(mockAddress)
      secondTime = false
      done()
    }, 1000)
  })
})
