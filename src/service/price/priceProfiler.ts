import { Emitter } from "../../types/emitter";
import { LastPrice } from "./lastPrice";

export class PriceProfiler extends Emitter {

  private lastPrice: LastPrice

  constructor(lastPrice: LastPrice) {
    super()
    this.lastPrice = lastPrice
  }
  
  subscribe(): void {
    this.lastPrice.on('prices', (data) => {
      this.emit('prices', data)
    })
    this.lastPrice.getLastPrice()
  }

  unsubscribe(): void {
    this.removeAllListeners('prices')
    this.lastPrice.removeAllListeners('prices')
  }

}