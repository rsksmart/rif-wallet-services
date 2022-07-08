import { Prices } from '../../api/types'

export abstract class PriceSupplier {
  readonly chainId:number

  constructor (chainId) {
    this.chainId = chainId
  }

  abstract getQuotesLatest(queryParams?: { addresses: string[], convert: string }): Promise<Prices>
}
