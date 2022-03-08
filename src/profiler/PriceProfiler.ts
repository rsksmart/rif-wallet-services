import { Emitter } from './Emitter'
import { LastPrice } from '../service/price/lastPrice'

export class PriceProfiler extends Emitter {
  private lastPrice: LastPrice
  private emitPrice = (data) => {
    this.emit('prices', data)
  }

  constructor (lastPrice: LastPrice) {
    super()
    this.lastPrice = lastPrice
  }

  subscribe (): void {
    this.lastPrice.on('prices', this.emitPrice)
    this.lastPrice.emitLastPrice()
  }

  unsubscribe (): void {
    this.lastPrice.off('prices', this.emitPrice)
  }
}
