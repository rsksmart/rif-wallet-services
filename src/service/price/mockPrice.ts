import { Prices } from '../../api/types'
import { PriceSupplier } from './priceSupplier'

// TODO: Remove when we have a price source for stablecoins
export class MockPrice extends PriceSupplier {
  static readonly prices = [
    // MainNet
    '0x2d919f19d4892381d58edebeca66d5642cef1a1f', // RDOC
    // TestNet
    '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8', // RDOC
    // MainNet
    '0x8dbf326e12a9ff37ed6ddf75ada548c2640a6482', // USDRIF
    // TestNet
    '0x8dbf326e12a9ff37ed6ddf75ada548c2640a6482' // USDRIF
  ]

  getQuotesLatest ():Promise<Prices> {
    const mockPrices = MockPrice.prices.reduce(
      (p, c) => ({
        ...p,
        [c]: {
          price: 1,
          lastUpdated: new Date().toISOString()
        }
      }), {}) as Prices

    return Promise.resolve(mockPrices)
  }
}
