import express from 'express'
import NodeCache from 'node-cache'
import request from 'supertest'

import { setupApi } from '../src/api'
import { CoinMarketCapAPI } from '../src/coinmarketcap'
import { mockCoinMarketCap, pricesResponse } from './mockResponses'

const setupTestApi = (coinMarketCapApi: CoinMarketCapAPI) => {
  const app = express()

  const priceCache = new NodeCache()
  setupApi(app, {
    rskExplorerApi: {} as any,
    coinMarketCapApi,
    registeredDapps: {} as any,
    priceCache,
    chainId: 30
  })

  return app
}

const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))

const coinMarketCapApiMock = {
  getQuotesLatest: getQuotesLatestMock
}

describe('coin market cap', () => {
  test('valid response', async () => {
    const app = setupTestApi(coinMarketCapApiMock as any)

    const { res: { text } } = await request(app)
      .get('/price?convert=USD&addresses=0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(getQuotesLatestMock).toHaveBeenCalledWith({ addresses: ['0x0000000000000000000000000000000000000000', '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'], convert: 'USD' })
    expect(JSON.parse(text)).toEqual(pricesResponse)
  })

  test('handles error', async () => {
    const getQuotesLatestThrowsMock = jest.fn(() => Promise.reject(new Error('error')))

    const coinMarketCapApiThrowsMock = {
      getQuotesLatest: getQuotesLatestThrowsMock
    }

    const app = setupTestApi(coinMarketCapApiThrowsMock as any)

    const res = await request(app)
      .get('/price?convert=USD&addresses=0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5')
      .expect(500)

    expect(res.text).toEqual('error')
  })

  describe('invalid requests', () => {
    test('convert not supported', async () => {
      const { axiosMock, coinMarketCapApi } = mockCoinMarketCap()
      const app = setupTestApi(coinMarketCapApi)

      const res = await request(app)
        .get('/price?convert=asd&addresses=0x0000000000000000000000000000000000000000,0x2acc95758f8b5f583470ba265eb685a8f45fc9d5')
        .expect(500)

      expect(res.text).toEqual('Convert not supported')
      expect(axiosMock.get).not.toHaveBeenCalled()
    })

    test('token address not supported', async () => {
      const { axiosMock, coinMarketCapApi } = mockCoinMarketCap()
      const app = setupTestApi(coinMarketCapApi)

      const res = await request(app)
        .get('/price?convert=USD&addresses=0x2acc95758f8b5f583470ba265eb685a8f45fc9d')
        .expect(200)

      expect(res.text).toEqual('{}')
      expect(axiosMock.get).not.toHaveBeenCalled()
    })
  })
})
