import express from 'express'
import request from 'supertest'
import { AddressController } from '../src/controller/address'
import { RSKExplorerAPI } from '../src/rskExplorerApi'
import { EventProvider } from '../src/service/event/eventProvider'
import { Profiler } from '../src/service/profiler'
import { TokenProvider } from '../src/service/token/tokenProvider'
import { TransactionProvider } from '../src/service/transaction/transactionProvider'
import { eventResponse, mockAddress, tokenResponse, transactionResponse } from './mockAddressResponses'

const setupTestApi = (rskExplorerApi: RSKExplorerAPI) => {
  const app = express()
  const addressController = new AddressController(app)
  const profiler = new Profiler()
  profiler.transactionProvider = new TransactionProvider(rskExplorerApi)
  profiler.eventProvider = new EventProvider(rskExplorerApi)
  profiler.tokenProvider = new TokenProvider(rskExplorerApi)
  addressController.profiler = profiler
  addressController.init()
  return app
}

const getEventsByAddressMock = jest.fn(() => Promise.resolve(eventResponse))
const getTransactionsByAddressMock = jest.fn(() => Promise.resolve(transactionResponse))
const getTokensByAddressMock = jest.fn(() => Promise.resolve(tokenResponse))
const rskExplorerApiMock = {
  getEventsByAddress: getEventsByAddressMock,
  getTransactionsByAddress: getTransactionsByAddressMock,
  getTokensByAddress: getTokensByAddressMock
}

describe('transactions', () => {
  test('get transactions', async () => {
    const app = setupTestApi(rskExplorerApiMock as any)

    const { res: { text } } = await request(app)
      .get(`/address/${mockAddress}/transactions?limit=50`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(transactionResponse)
    expect(getTransactionsByAddressMock).toHaveBeenCalledWith(mockAddress, '50', undefined, undefined)
  })
})

describe('tokens', () => {
  test('get tokens', async () => {
    const app = setupTestApi(rskExplorerApiMock as any)

    const { res: { text } } = await request(app)
      .get(`/address/${mockAddress}/tokens`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(tokenResponse)
    expect(getTokensByAddressMock).toHaveBeenCalledWith(mockAddress)
  })
})

describe('events', () => {
  test('get events', async () => {
    const app = setupTestApi(rskExplorerApiMock as any)

    const { res: { text } } = await request(app)
      .get(`/address/${mockAddress}/events`)
      .expect('Content-Type', /json/)
      .expect(200)
    expect(JSON.parse(text)).toEqual(eventResponse)
    expect(getEventsByAddressMock).toHaveBeenCalledWith(mockAddress)
  })
})
