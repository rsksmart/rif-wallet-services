import { BalanceProvider } from '../src/service/balance/balanceProvider'
import { LastPrice } from '../src/service/price/lastPrice'
import { PriceCollector } from '../src/service/price/priceCollector'
import { TransactionProvider } from '../src/service/transaction/transactionProvider'
import { mockAddress, tokenResponse, transactionResponse, eventResponse, txResponse } from './mockAddressResponses'
import { pricesResponse } from './mockPriceResponses'
import { TokenTransferProvider } from '../src/service/tokenTransfer/tokenTransferProvider'
import { MockPrice } from '../src/service/price/mockPrice'
import winston from 'winston'

const getTransactionsByAddressMock = jest.fn(() => Promise.resolve((transactionResponse)))
const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
const getEventsByAddressMock = jest.fn(() => Promise.resolve(eventResponse))
const getTransactionMock = jest.fn(() => Promise.resolve(txResponse))

describe('Emmitting Events', () => {
  test('emit transactions', async () => {
    const rskExplorerApiMock = {
      getTransactionsByAddress: getTransactionsByAddressMock,
      getTransaction: getTransactionMock,
      getEventsByAddress: getEventsByAddressMock
    }
    const transactionProvider = new TransactionProvider(mockAddress, rskExplorerApiMock as any)
    transactionProvider.on(mockAddress, async (data) => {
      const { type } = data
      expect(type).toEqual('newTransaction')
    })
    await transactionProvider.subscribe(mockAddress)
    transactionProvider.unsubscribe()
  })

  test('emit balances', async () => {
    const rskExplorerApiMock = {
      getTokensByAddress: getTokensByAddressMock
    }
    const balanceProvider = new BalanceProvider(mockAddress, rskExplorerApiMock as any)
    balanceProvider.on(mockAddress, (data) => {
      const { type, payload } = data
      expect(type).toEqual('newBalance')
      expect(payload).toEqual(tokenResponse[0])
    })
    await balanceProvider.subscribe(mockAddress)
    balanceProvider.unsubscribe()
  })

  test('emit prices', async () => {
    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }
    const mockPrice = new MockPrice()
    const lastPrice = new LastPrice()
    lastPrice.on('prices', (data) => {
      const { type, payload } = data
      expect(type).toEqual('newPrice')
      expect(payload).toEqual(pricesResponse)
    })

    const logger = winston.createLogger()

    const priceCollector = new PriceCollector([coinMarketCapApiMock as any, mockPrice], 'USD', 5 * 60 * 1000, logger)
    priceCollector.once('prices', (prices) => {
      lastPrice.save(prices)
    })

    await priceCollector.init()
    priceCollector.stop()
  })

  test('emit token transfers', async () => {
    const rskExplorerApiMock = {
      getEventsByAddress: getEventsByAddressMock
    }

    const tokenTransferProvider = new TokenTransferProvider(mockAddress, rskExplorerApiMock as any)
    tokenTransferProvider.on(mockAddress, async (data) => {
      const { type, payload } = data
      expect(type).toEqual('newTokenTransfer')
      expect(payload).toEqual(eventResponse[0])
    })

    await tokenTransferProvider.subscribe(mockAddress)
    tokenTransferProvider.unsubscribe()
  })
})
