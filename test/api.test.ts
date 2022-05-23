import express from 'express'
import request from 'supertest'

import { HttpsAPI } from '../src/controller/httpsAPI'
import { mockCoinMarketCap, pricesResponse } from './mockPriceResponses'

import { CustomError } from '../src/middleware'
import { CoinMarketCapAPI } from '../src/coinmarketcap'
import { LastPrice } from '../src/service/price/lastPrice'
import { PriceCollector } from '../src/service/price/priceCollector'

let priceCollector

const setupTestApi = (coinMarketCapApi: CoinMarketCapAPI) => {
  const app = express()
  priceCollector = new PriceCollector(coinMarketCapApi, 'USD', 30, 5 * 60 * 1000)
  const lastPrice = new LastPrice(30)
  priceCollector.on('prices', (prices) => {
    lastPrice.save(prices)
  })
  priceCollector.init()
  const httpsAPI = new HttpsAPI(app, {} as any, lastPrice)
  httpsAPI.init()
  return app
}

const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
const coinMarketCapApiMock = {
  getQuotesLatest: getQuotesLatestMock
}

afterEach(() => {
  priceCollector.stop()
})

describe('coin market cap', () => {
  test('valid response', async () => {
    const app = setupTestApi(coinMarketCapApiMock as any)
    const addresses = [
      '0x0000000000000000000000000000000000000000',
      '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
    ]
    const { res: { text } } = await request(app)
      .get(`/price?convert=USD&addresses=${addresses.join(',')}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(JSON.parse(text)).toEqual(pricesResponse)
  })

  test('handles error', async () => {
    const getQuotesLatestThrowsMock = jest.fn(() => Promise.reject(new CustomError('error', 500)))

    const coinMarketCapApiThrowsMock = {
      getQuotesLatest: getQuotesLatestThrowsMock
    }

    const app = setupTestApi(coinMarketCapApiThrowsMock as any)
    const addresses = [
      '0x0000000000000000000000000000000000000000',
      '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
    ]
    const res = await request(app)
      .get(`/price?convert=USD&addresses=${addresses.join(',')}`)
      .expect(200)
    expect(res.text).toEqual('{}')
  })

  describe('invalid requests', () => {
    test('convert not supported', async () => {
      const { axiosMock, coinMarketCapApi } = mockCoinMarketCap()
      const app = setupTestApi(coinMarketCapApi)
      const addresses = [
        '0x0000000000000000000000000000000000000000',
        '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
      ]
      const res = await request(app)
        .get(`/price?convert=asd&addresses=${addresses.join(',')}`)
        .expect(500)

      expect(res.text).toEqual('Convert not supported')
      expect(axiosMock.get).toHaveBeenCalledTimes(1)
    })

    test('token address not supported', async () => {
      const { axiosMock, coinMarketCapApi } = mockCoinMarketCap()
      const app = setupTestApi(coinMarketCapApi)

      const res = await request(app)
        .get('/price?convert=USD&addresses=0x2acc95758f8b5f583470ba265eb685a8f45fc9d')
        .expect(200)

      expect(res.text).toEqual('{}')
      expect(axiosMock.get).toHaveBeenCalledTimes(1)
    })
  })
})
