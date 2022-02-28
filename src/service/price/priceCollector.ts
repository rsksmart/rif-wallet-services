import { CoinMarketCapAPI } from '../../coinmarketcap'
import EventEmitter from 'events'
import { addressToCoinmarketcapId } from '../../coinmarketcap/support'
import { Prices } from '../../api/types'

export class PriceCollector extends EventEmitter {
  private coinMarketCapApi: CoinMarketCapAPI
  private cmcPollingTime: number
  private convert: string
  private chainId: number

  constructor (coinMarketCapApi: CoinMarketCapAPI, convert: string, chainId: number, cmcPollingTime) {
    super()
    this.coinMarketCapApi = coinMarketCapApi
    this.convert = convert
    this.chainId = chainId
    this.cmcPollingTime = cmcPollingTime
  }

  getPrices = (): Promise<Prices> => this.coinMarketCapApi.getQuotesLatest({
    addresses: Object.keys(addressToCoinmarketcapId[this.chainId]),
    convert: this.convert
  }).catch(error => {
    console.log(error)
    return {}
  })

  async emitPrice (prices: Prices) {
    this.emit('prices', prices)
  }

  async init () {
    this.getAndEmitPrices()
    setInterval(this.getAndEmitPrices, this.cmcPollingTime)
  }

  private getAndEmitPrices = () =>
    this.getPrices().then((prices) => this.emitPrice(prices))
}
