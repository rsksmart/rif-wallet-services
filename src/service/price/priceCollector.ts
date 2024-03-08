import EventEmitter from 'events'
import { addressToCoinmarketcapId } from '../../coinmarketcap/support'
import { Prices } from '../../api/types'
import { PriceSupplier } from './priceSupplier'
import { Logger } from 'winston'

export class PriceCollector extends EventEmitter {
  private suppliers: PriceSupplier[]
  private cmcPollingTime: number
  private convert: string
  private timer!: NodeJS.Timer
  private logger: Logger

  constructor (suppliers: PriceSupplier[],
    convert: string, cmcPollingTime: number, logger: Logger) {
    super()
    this.suppliers = suppliers
    this.convert = convert
    this.cmcPollingTime = cmcPollingTime
    this.logger = logger
  }

  getPrices = (): Promise<Prices> => {
    const lastPrices: Promise<Prices>[] = this.suppliers.map(supplier =>
      supplier.getQuotesLatest({
        addresses: Object.keys(addressToCoinmarketcapId),
        convert: this.convert
      }).catch(e => {
        this.logger.error('Exception collecting price', e)
        return Promise.resolve({} as Prices)
      }
      )
    )
    return Promise.all(lastPrices)
      .then(prices =>
        Promise.resolve(prices.reduce(
          (p, c) => ({ ...p, ...c }), {}
        )))
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
