import { CoinMarketCapAPI } from '../../coinmarketcap'
import axios from 'axios'
import { isConvertSupported, isTokenSupported } from '../../coinmarketcap/validations'
import { PriceCache } from './priceCache'

export class CoinMarketCapPriceProvider {
  private coinMarketCapApi: CoinMarketCapAPI
  private priceCache: PriceCache
  private CHAIN_ID: number

  constructor () {
    this.CHAIN_ID = parseInt(process.env.CHAIN_ID as string) || 31
    const COIN_MARKET_CAP_URL = process.env.COIN_MARKET_CAP_URL as string || 'https://pro-api.coinmarketcap.com'
    const COIN_MARKET_CAP_VERSION = process.env.COIN_MARKET_CAP_VERSION as string || 'v1'
    const COIN_MARKET_CAP_KEY = process.env.COIN_MARKET_CAP_KEY! as string
    this.coinMarketCapApi =
      new CoinMarketCapAPI(
        COIN_MARKET_CAP_URL,
        COIN_MARKET_CAP_VERSION,
        COIN_MARKET_CAP_KEY,
        axios,
        this.CHAIN_ID)
    this.priceCache = new PriceCache()
  }

  validation (addresses: string[], convert: string): string[] {
    addresses = addresses.filter((address) => isTokenSupported(address, this.CHAIN_ID))

    if (!isConvertSupported(convert)) throw new Error('Convert not supported')
    return addresses
  }

  getQuotesLatest (addresses: string[], convert:string) {
    const { missingAddresses, pricesInCache } = this.priceCache.find(addresses)
    if (!missingAddresses.length) return Promise.resolve(pricesInCache)

    const prices = this.coinMarketCapApi.getQuotesLatest({ addresses: missingAddresses, convert })
    return prices
      .then(pricesFromCMC => {
        this.priceCache.store(pricesFromCMC)
        return {
          ...pricesInCache,
          ...pricesFromCMC
        }
      })
  }
}
