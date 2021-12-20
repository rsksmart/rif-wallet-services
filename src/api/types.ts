
// coinmarketcap
export type PricesQueryParams = { addresses: string, convert: string }
export type Prices = { [address: string]: {
  lastUpdated: string
} }
