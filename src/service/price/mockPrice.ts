import { Prices } from '../../api/types'
import { PriceSupplier } from './priceSupplier'

// TODO: Remove when we have a price source for stablecoins
export class MockPrice extends PriceSupplier {
  static readonly prices = {
    30: [
      '0x2d919f19d4892381d58edebeca66d5642cef1a1f', // RDOC
      '0xe700691da7b9851f2f35f8b8182c69c53ccad9db' // DOC
    ],
    31: [
      '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8', // RDOC
      '0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0' // DOC
    ]
  }

  getQuotesLatest ():Promise<Prices> {
    const mockPrices = MockPrice.prices[this.chainId].reduce(
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
