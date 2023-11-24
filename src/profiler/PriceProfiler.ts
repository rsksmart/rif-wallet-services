import { Emitter } from './Emitter'
import { LastPrice } from '../service/price/lastPrice'

export class PriceProfiler extends Emitter {
  private lastPrice: LastPrice
  private channelName: string
  private emitPrice = (data) => {
    this.emit(this.channelName, data)
  }

  constructor (lastPrice: LastPrice, channel: string) {
    super()
    this.lastPrice = lastPrice
    this.channelName = channel
  }

  get channel () {
    return this.channelName
  }

  subscribe (): void {
    this.lastPrice.on(this.channelName, this.emitPrice)
    // this.lastPrice.emitLastPrice(this.channelName) // REMOVED for now - see US-2023
  }

  unsubscribe (): void {
    this.lastPrice.off(this.channelName, this.emitPrice)
  }
}
