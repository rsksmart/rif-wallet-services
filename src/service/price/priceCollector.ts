import { CoinMarketCapAPI } from "../../coinmarketcap";
import EventEmitter from 'events'
import { addressToCoinmarketcapId } from "../../coinmarketcap/support";
import { Prices } from "../../api/types";

export class PriceCollector extends EventEmitter{

  private coinMarketCapApi: CoinMarketCapAPI
  private cmcPollingTime = 5*60*1000
  private convert: string
  private chainId: number

  constructor(coinMarketCapApi: CoinMarketCapAPI , convert: string, chainId: number) {
    super()
    this.coinMarketCapApi = coinMarketCapApi
    this.convert = convert
    this.chainId = chainId
  }

  async getPrices(): Promise<Prices> {
    const tokenAddresses = Object.keys(addressToCoinmarketcapId[this.chainId])
    const prices = await this.coinMarketCapApi.getQuotesLatest({addresses: tokenAddresses, convert: this.convert})
    return prices
  }

  async emitPrice(prices: Prices) {
    this.emit('prices',prices)
  }

  async init() {
    const getAndEmitPrices = () => this.getPrices().then((prices) => this.emitPrice(prices))
    getAndEmitPrices()
    setInterval(getAndEmitPrices, this.cmcPollingTime)
  }
}