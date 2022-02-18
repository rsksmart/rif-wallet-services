import { Emitter } from "../../types/emitter";
import { PriceProvider } from "./priceProvider";

export class PriceEmitter extends Emitter {
  
  priceProvider = new PriceProvider()

  subscribe(): void {
    this.priceProvider.on('prices', (data) => {
      this.emit('prices', data)
    })
    this.priceProvider.provide('address')
  }

  unsubscribe(): void {
    this.removeAllListeners()
  }

}