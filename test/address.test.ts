import express from 'express'
import request from 'supertest'
import { HttpsAPI } from '../src/controller/httpsAPI'
import { DataSource } from '../src/repository/DataSource'
import { eventResponse, mockAddress, tokenResponse, transactionResponse } from './mockAddressResponses'
import BitcoinCore from '../src/service/bitcoin/BitcoinCore'

const setupTestApi = (dataSourceMapping: Map<string, DataSource>) => {
  const app = express()
  const httpsAPI = new HttpsAPI(app, dataSourceMapping, {}, new BitcoinCore(''))
  httpsAPI.init()
  return app
}

const getEventsByAddressMock = jest.fn(() => Promise.resolve(eventResponse))
const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
const rskExplorerApiMock = {
  getEventsByAddress: getEventsByAddressMock,
  getTransactionsByAddress: getTransactionsByAddressMock,
  getTokensByAddress: getTokensByAddressMock
} as any
const dataSourceMapping = new Map<string, DataSource>()
dataSourceMapping.set('31', rskExplorerApiMock)

describe('transactions', () => {
  test('get transactions', async () => {
    const app = setupTestApi(dataSourceMapping)

    const { text } = await request(app)
      .get(`/address/${mockAddress}/transactions?limit=50`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(transactionResponse)
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

    expect(JSON.parse(text)).toEqual(tokenResponse)
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
