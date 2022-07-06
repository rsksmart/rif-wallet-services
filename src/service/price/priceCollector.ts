import { CoinMarketCapAPI } from '../../coinmarketcap'
import EventEmitter from 'events'
import { addressToCoinmarketcapId } from '../../coinmarketcap/support'
import { Prices } from '../../api/types'
import { MockPrice } from './mockPrice'

export class PriceCollector extends EventEmitter {
  private coinMarketCapApi: CoinMarketCapAPI
  private mockPrice: MockPrice
  private cmcPollingTime: number
  private convert: string
  private chainId: number
  private timer!: NodeJS.Timer

  constructor (coinMarketCapApi: CoinMarketCapAPI, mockPrice: MockPrice,
    convert: string, chainId: number, cmcPollingTime: number) {
    super()
    this.coinMarketCapApi = coinMarketCapApi
    this.mockPrice = mockPrice
    this.convert = convert
    this.chainId = chainId
    this.cmcPollingTime = cmcPollingTime
  }

  getPrices = (): Promise<Prices> => {
    const coinMarketCapPrices = this.coinMarketCapApi.getQuotesLatest({
      addresses: Object.keys(addressToCoinmarketcapId[this.chainId]),
      convert: this.convert
    }).catch(error => {
      console.log(error)
      return Promise.resolve({} as Prices)
    })
    return Promise.all([
      this.mockPrice.getPrices(),
      coinMarketCapPrices
    ]).then(([mockPrices, realPrices]) => Promise.resolve({ ...mockPrices, ...realPrices }))
  }

  async emitPrice (prices: Prices) {
    this.emit('prices', prices)
  }

  async init () {
    this.getAndEmitPrices()
    this.timer = setInterval(this.getAndEmitPrices, this.cmcPollingTime)
  }

  stop () {
    clearInterval(this.timer)
  }

  private getAndEmitPrices = () =>
    this.getPrices().then((prices) => this.emitPrice(prices))
}
