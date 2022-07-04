import { Prices } from '../../api/types'

// TODO: Remove when we have a price source for stablecoins
export class MockPrice {
  private chainId: number
  private prices = {
    30: [],
    31: [
      '0xC3De9f38581F83e281F260D0ddBAac0E102Ff9F8', // RDOC
      '0xCb46C0DdC60d18eFEB0e586c17AF6Ea36452DaE0' // DOC
    ]
  }

  constructor (chainId) {
    this.chainId = chainId
  }

  getPrices ():Promise<Prices> {
    const mockPrices = this.prices[this.chainId].reduce(
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
