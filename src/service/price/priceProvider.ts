import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Provider } from '../../util/provider'
import { CoinMarketCapPriceProvider } from './coinMarketCapPriceProvider'

export class PriceProvider extends EventEmitter implements Provider {
  private coinMarketCapPriceProvider: CoinMarketCapPriceProvider
  private rskExplorerApi: RSKExplorerAPI
  private EXECUTION_INTERVAL = 60000
  private DEFAULT_CONVERT_FIAT = process.env.DEFAULT_CONVERT_FIAT! as string
  private timers = {}
  constructor (coinMarketCapPriceProvider?: CoinMarketCapPriceProvider) {
    super()
    this.rskExplorerApi = RSKExplorerAPI.getInstance()
    this.coinMarketCapPriceProvider = coinMarketCapPriceProvider ? coinMarketCapPriceProvider : new CoinMarketCapPriceProvider()
  }

  getPrices (addresses: string[], convert: string) {
    const listAddresses = this.coinMarketCapPriceProvider.validation(addresses, convert)
    if (listAddresses.length === 0) return Promise.resolve({})

    return this.coinMarketCapPriceProvider.getQuotesLatest(listAddresses, convert)
  }

  private async execute (address: string) {
    const RBTC = '0x0000000000000000000000000000000000000000'
    const addresses = [RBTC, ...(await this.rskExplorerApi.getTokensByAddress(address.toLowerCase()))
      .map(token => token.contractAddress.toLocaleLowerCase())]

    this.getPrices(addresses, this.DEFAULT_CONVERT_FIAT).then(prices => {
      this.emit(address, { type: 'newPrice', payload: prices })
    })
  }

  subscribe (address: string): void {
    this.execute(address)
    const timer = setInterval(() => this.execute(address), this.EXECUTION_INTERVAL)
    this.timers[address] = timer
  }

  unsubscribe (address: string): void {
    this.removeAllListeners(address)
    clearInterval(this.timers[address])
  }
}
