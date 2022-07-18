import { Prices } from '../../api/types'

export abstract class PriceSupplier {
  abstract getQuotesLatest(queryParams?: { addresses: string[], convert: string }): Promise<Prices>
}
