import _axios, { AxiosResponse } from 'axios'
import { ICoinMarketCapQuoteParams, ICoinMarketCapQuoteResponse } from './types'
import { addressToCoinmarketcapId } from './support'
import { isTokenSupported } from './validations'
import { Prices } from '../api/types'
import { PriceSupplier } from '../service/price/priceSupplier'

type PricesQueryParams = { addresses: string[], convert: string }

const fromQueryParamsToRequestParams = (params: PricesQueryParams): ICoinMarketCapQuoteParams => {
  const coinMarketCapIds: string[] = params.addresses
    .filter((address) => isTokenSupported(address))
    .map(address => addressToCoinmarketcapId[address])
  return ({
    id: [Array.from(new Set(coinMarketCapIds))].join(','),
    convert: params.convert
  })
}

const fromQuotesResponseToPrices =
  (convert: string, addresses: string[], coinmarketcapIdToAddress: Record<string, string[]>) =>
    (response: AxiosResponse<ICoinMarketCapQuoteResponse>) =>
      Object.keys(response.data.data).reduce<Prices>((p, c) => {
        return ({
          ...p,
          ...coinmarketcapIdToAddress[c].filter(address => addresses.includes(address))
            .map(address => ({
              [address]: {
                price: response.data.data[c].quote[convert].price,
                lastUpdated: response.data.data[c].last_updated
              }
            })).reduce((p, c) => ({ ...p, ...c }))
        })
      }, {})

export class CoinMarketCapAPI extends PriceSupplier {
  headers: { 'X-CMC_PRO_API_KEY': string }
  baseURL: string
  axios: typeof _axios
  coinmarketcapIdToAddress: Record<string, string[]>

  constructor (
    url: string,
    version: string,
    apiKey: string,
    axios: typeof _axios
  ) {
    super()
    this.baseURL = `${url}/${version}`
    this.headers = {
      'X-CMC_PRO_API_KEY': apiKey
    }
    this.axios = axios
    this.coinmarketcapIdToAddress = Object.keys(addressToCoinmarketcapId)
      .reduce((p, c) => {
        if (p[addressToCoinmarketcapId[c]]) {
          p[addressToCoinmarketcapId[c]].push(c)
          return ({ ...p })
        }
        return ({ ...p, [addressToCoinmarketcapId[c]]: [c] })
      }, {})
  }

  getQuotesLatest = (queryParams: PricesQueryParams): Promise<Prices> => this.axios.get<ICoinMarketCapQuoteResponse>(
    `${this.baseURL}/cryptocurrency/quotes/latest`, {
      headers: this.headers,
      params: fromQueryParamsToRequestParams(queryParams)
    }).then(fromQuotesResponseToPrices(queryParams.convert!, queryParams.addresses, this.coinmarketcapIdToAddress))
}
