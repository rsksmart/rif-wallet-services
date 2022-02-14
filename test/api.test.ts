import express from 'express'
import NodeCache from 'node-cache'
import request from 'supertest'

import { AddressController } from '../src/controller/address'
import {
  mockCoinMarketCap, pricesResponse, pricesResponseForCaching,
  rifPriceFromCache, sovPriceFromCache
} from './mockPriceResponses'

import { CustomError } from '../src/middleware'
import { Profiler } from '../src/service/profiler'
import { CoinMarketCapPriceProvider } from '../src/service/price/coinMarketCapPriceProvider'
import { PriceProvider } from '../src/service/price/priceProvider'
import { CoinMarketCapAPI } from '../src/coinmarketcap'
import { PriceCache } from '../src/service/price/priceCache'

const setupTestApi = (coinMarketCapApi: CoinMarketCapAPI, cache: NodeCache = new NodeCache()) => {
  process.env.CHAIN_ID = '30'
  const app = express()
  const addressController = new AddressController(app)
  const profiler = new Profiler()
  const coinMarketCapPriceProvider = new CoinMarketCapPriceProvider(coinMarketCapApi as any, new PriceCache(cache))
  const priceProvider = new PriceProvider(coinMarketCapPriceProvider)
  profiler.priceProvider = priceProvider
  addressController.profiler = profiler
  addressController.init()
  return app
}

const getQuotesLatestMock = jest.fn(() => Promise.resolve(pricesResponse))
const coinMarketCapApiMock = {
  getQuotesLatest: getQuotesLatestMock
}

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

    expect(getQuotesLatestMock).toHaveBeenCalledWith(
      {
        addresses: [
          '0x0000000000000000000000000000000000000000',
          '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
        ],
        convert: 'USD'
      }
    )
    expect(JSON.parse(text)).toEqual(pricesResponse)
  })

  test('valid response from cache', async () => {
    const cache = new NodeCache()
    cache.set('0xefc78fc7d48b64958315949279ba181c2114abbd', sovPriceFromCache)
    const app = setupTestApi(coinMarketCapApiMock as any, cache)
    const addresses = [
      '0x0000000000000000000000000000000000000000',
      '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
      '0xefc78fc7d48b64958315949279ba181c2114abbd'
    ]
    const { res: { text } } = await request(app)
      .get(`/price?convert=USD&addresses=${addresses.join(',')}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(getQuotesLatestMock).toHaveBeenCalledWith(
      {
        addresses: [
          '0x0000000000000000000000000000000000000000',
          '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
        ],
        convert: 'USD'
      }
    )
    expect(JSON.parse(text)).toEqual(pricesResponseForCaching)
  })

  test('valid response with cache invalidated', async () => {
    const cache = new NodeCache()
    cache.set('0xefc78fc7d48b64958315949279ba181c2114abbd', rifPriceFromCache)
    const app = setupTestApi(coinMarketCapApiMock as any, cache)
    cache.flushAll()
    const addresses = [
      '0x0000000000000000000000000000000000000000',
      '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
    ]
    const { res: { text } } = await request(app)
      .get(`/price?convert=USD&addresses=${addresses.join(',')}`)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(getQuotesLatestMock).toHaveBeenCalledWith(
      {
        addresses: [
          '0x0000000000000000000000000000000000000000',
          '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
        ],
        convert: 'USD'
      }
    )
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
      .expect(500)

    expect(res.text).toEqual('error')
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
