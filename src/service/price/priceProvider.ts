import EventEmitter from 'events'
import { Provider } from '../../util/provider'
import { CoinMarketCapPriceProvider } from './coinMarketCapPriceProvider'

export class PriceProvider extends EventEmitter implements Provider {
  private coinMarketCapPriceProvider: CoinMarketCapPriceProvider

  constructor () {
    super()
    this.coinMarketCapPriceProvider = new CoinMarketCapPriceProvider()
  }

  getPrices (addresses: string, convert: string) {
    const listAddresses = this.coinMarketCapPriceProvider.validation(addresses.split(','), convert)
    if (listAddresses.length === 0) return Promise.resolve({})

    return this.coinMarketCapPriceProvider.getQuotesLatest(listAddresses, convert)

    // const { missingAddresses, pricesInCache } = findInCache(addresses, priceCache)
    // if (!missingAddresses.length) return responseJsonOk(res)(pricesInCache)

    // const prices = coinMarketCapApi.getQuotesLatest({ addresses: missingAddresses, convert })
    // prices
    //   .then(pricesFromCMC => {
    //     storeInCache(pricesFromCMC, priceCache)
    //     const pricesRes = {
    //       ...pricesInCache,
    //       ...pricesFromCMC
    //     }
    //     return responseJsonOk(res)(pricesRes)
    //   })
    //   .catch(next)
  }

  subscribe (address: string): void {
    throw new Error('Method not implemented.')
  }

  unsubscribe (address: string): void {
    throw new Error('Method not implemented.')
  }
}
