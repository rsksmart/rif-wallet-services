import _axios, { AxiosResponse } from 'axios'
import { ICoinMarketCapQuoteParams, ICoinMarketCapQuoteResponse } from './types'
import { addressToCoinmarketcapId } from './support'
import { Prices } from '../api/types'

type PricesQueryParams = { addresses: string[], convert: string }

const coinmarketcapIdToAddress = Object.keys(addressToCoinmarketcapId)
  .reduce((p, c) => ({ ...p, [addressToCoinmarketcapId[c]]: c }), {})

const fromQueryParamsToRequestParams = (params: PricesQueryParams): ICoinMarketCapQuoteParams => ({
  id: params.addresses.map(address => addressToCoinmarketcapId[address]).join(','),
  convert: params.convert
})

const fromQuotesResponseToPrices =
  (convert: string) =>
    (response: AxiosResponse<ICoinMarketCapQuoteResponse>) =>
      Object.keys(response.data.data).reduce<Prices>((p, c) => ({
        ...p,
        [coinmarketcapIdToAddress[c]]: {
          price: response.data.data[c].quote[convert].price,
          lastUpdated: response.data.data[c].last_updated
        }
      }), {})

export class CoinMarketCapAPI {
  headers: { 'X-CMC_PRO_API_KEY': string }
  baseURL: string
  axios: typeof _axios

  constructor (
    url: string,
    version: string,
    apiKey: string,
    axios: typeof _axios
  ) {
    this.baseURL = `${url}/${version}`
    this.headers = {
      'X-CMC_PRO_API_KEY': apiKey
    }
    this.axios = axios
  }

  getQuotesLatest = (queryParams: PricesQueryParams): Promise<Prices> => this.axios.get<ICoinMarketCapQuoteResponse>(
    `${this.baseURL}/cryptocurrency/quotes/latest`, {
      headers: this.headers,
      params: fromQueryParamsToRequestParams(queryParams)
    }).then(fromQuotesResponseToPrices(queryParams.convert!))
}
