import express from 'express'
import request from 'supertest'
import { HttpsAPI } from '../src/controller/httpsAPI'
import { RSKDatasource } from '../src/repository/DataSource'
import {
  eventResponse, mockAddress, rbtcBalanceResponse,
  tokenResponse, transactionFromEventResponse, transactionResponse, transactionWithEventResponse
} from './mockAddressResponses'
import BitcoinCore from '../src/service/bitcoin/BitcoinCore'
import { LastPrice } from '../src/service/price/lastPrice'
import { MockProvider } from './MockProvider'
import { AddressService } from '../src/service/address/AddressService'

const setupTestApi = (dataSourceMapping: RSKDatasource) => {
  const app = express()
  const bitcoinMapping = {}
  bitcoinMapping['31'] = new BitcoinCore({
    BLOCKBOOK_URL: process.env.BLOCKBOOK_URL || '',
    CYPHER_ESTIMATE_FEE_URL: process.env.CYPHER_ESTIMATE_FEE_URL || ''
  })
  const providerMapping = {}
  providerMapping['31'] = new MockProvider(31)
  const lastPrice = new LastPrice()
  const addressService = new AddressService({
    dataSourceMapping,
    lastPrice,
    providerMapping
  })
  const httpsAPI = new HttpsAPI({ app, dataSourceMapping, bitcoinMapping, addressService })
  httpsAPI.init()
  return app
}

const getEventsByAddressMock = jest.fn(() => Promise.resolve(eventResponse))
const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
const getTransactionMock = jest.fn(() => Promise.resolve(transactionFromEventResponse))
const getInternalTransactionByAddressMock = jest.fn(() => Promise.resolve({ data: [] }))
const rskExplorerApiMock = {
  getEventsByAddress: getEventsByAddressMock,
  getTransactionsByAddress: getTransactionsByAddressMock,
  getTokensByAddress: getTokensByAddressMock,
  getTransaction: getTransactionMock,
  getInternalTransactionByAddress: getInternalTransactionByAddressMock
} as any
const dataSourceMapping = {}
dataSourceMapping['31'] = rskExplorerApiMock

describe('transactions', () => {
  test('get transactions', async () => {
    const app = setupTestApi(dataSourceMapping)

    const { text } = await request(app)
      .get(`/address/${mockAddress}/transactions?limit=50`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(transactionWithEventResponse)
    expect(getTransactionsByAddressMock).toHaveBeenCalledWith(mockAddress, '50', undefined, undefined, '0')
  })
})

describe('tokens', () => {
  test('get tokens', async () => {
    const app = setupTestApi(dataSourceMapping)

    const { text } = await request(app)
      .get(`/address/${mockAddress}/tokens`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(JSON.parse(text)).toEqual([...tokenResponse, ...rbtcBalanceResponse])
    expect(getTokensByAddressMock).toHaveBeenCalledWith(mockAddress)
  })
})

describe('events', () => {
  test('get events', async () => {
    const app = setupTestApi(dataSourceMapping)

    const { text } = await request(app)
      .get(`/address/${mockAddress}/events`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(eventResponse)
    expect(getEventsByAddressMock).toHaveBeenCalledWith(mockAddress)
  })
})
