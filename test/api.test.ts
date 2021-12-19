import express from 'express'
import request from 'supertest'

import { setupApi } from '../src/api'
import { CoinMarketCapAPI } from '../src/coinmatketcap'
import { pricesResponse } from './mockResponses'

const setupTestApi = (coinMarketCapApi: CoinMarketCapAPI) => {
  const app = express()

  setupApi(app, {
    rskExplorerApi: {} as any,
    coinMarketCapApi,
    registeredDapps: {} as any
  })

  return app
}

describe('coin market cap', () => {
  test('valid response', async () => {
    const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))

    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }

    const app = setupTestApi(coinMarketCapApiMock as any)

    const { res: { text } } = await request(app)
      .get('/price?convert=USD&addresses=0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(getQuotesLatestMock).toHaveBeenCalledWith({addresses:'0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5', convert: 'USD' })
    expect(JSON.parse(text)).toEqual(pricesResponse)
  })

  test('handles error', async () => {
    const getQuotesLatestMock = jest.fn(() => Promise.reject(new Error('error')))

    const coinMarketCapApiMock = {
      getQuotesLatest: getQuotesLatestMock
    }

    const app = setupTestApi(coinMarketCapApiMock as any)

    const res = await request(app)
      .get('/price?convert=USD&addresses=0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5')
      .expect(500)

    expect(res.text).toEqual('error')
  })
})
