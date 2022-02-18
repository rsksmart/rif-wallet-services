import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { PollingProvider } from '../../types/provider'
import { CoinMarketCapPriceProvider } from './coinMarketCapPriceProvider'

export class PriceProvider extends PollingProvider {
  private rskExplorerApi: RSKExplorerAPI
  private DEFAULT_CONVERT_FIAT = process.env.DEFAULT_CONVERT_FIAT! as string
  private coinMarketCapPriceProvider: CoinMarketCapPriceProvider
  
  constructor (coinMarketCapPriceProvider?: CoinMarketCapPriceProvider, rskExplorerApi?: RSKExplorerAPI) {
    super()
    this.rskExplorerApi = rskExplorerApi || RSKExplorerAPI.getInstance()
    this.coinMarketCapPriceProvider = coinMarketCapPriceProvider || new CoinMarketCapPriceProvider()
  }
  
  getPrices (addresses: string[], convert: string) {
    const listAddresses = this.coinMarketCapPriceProvider.validation(addresses, convert)
    if (listAddresses.length === 0) return Promise.resolve({})
    
    return this.coinMarketCapPriceProvider.getQuotesLatest(listAddresses, convert)
  }
  
  async provide (address: string) {
    const RBTC = '0x0000000000000000000000000000000000000000'
    const addresses = [RBTC, ...(await this.rskExplorerApi.getTokensByAddress(address.toLowerCase()))
      .map(token => token.contractAddress.toLocaleLowerCase())]
      
      this.getPrices(addresses, this.DEFAULT_CONVERT_FIAT).then(prices => {
        this.emit(address, { type: 'newPrice', payload: prices })
      })
  }
  subscribe(): void {
    throw new Error('Method not implemented.')
  }
  unsubscribe(): void {
    throw new Error('Method not implemented.')
  }
}
  