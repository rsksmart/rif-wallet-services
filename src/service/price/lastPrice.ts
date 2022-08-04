import EventEmitter from 'events'
import { Prices } from '../../api/types'
import { isConvertSupported, isTokenSupported } from '../../coinmarketcap/validations'

export class LastPrice extends EventEmitter {
  private prices: Prices

  constructor () {
    super()
    this.prices = {}
  }

  validate (addresses: string[], convert: string): string[] {
    addresses = addresses.filter((address) => isTokenSupported(address))

    if (!isConvertSupported(convert)) throw new Error('Convert not supported')
    return addresses
  }

  emitLastPrice (channel: string): void {
    this.emit(channel, { type: 'newPrice', payload: this.prices })
  }

  getPrices (addresses: string[], convert: string): Promise<Prices> {
    const validatedAddresses = this.validate(addresses, convert)
    const prices = {}
    for (const address of validatedAddresses) {
      prices[address] = this.prices[address]
    }
    return Promise.resolve(prices)
  }

  save (prices: Prices) {
    this.prices = prices
  }
}
