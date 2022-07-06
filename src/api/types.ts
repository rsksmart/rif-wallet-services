
// coinmarketcap
export type PricesQueryParams = { addresses: string, convert: string }
export type Prices = { [address: string]: {
  price: number,
  lastUpdated: string
} }
