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
  }

  subscribe (address: string): void {

  }

  unsubscribe (address: string): void {
    this.removeAllListeners(address)
  }
}
