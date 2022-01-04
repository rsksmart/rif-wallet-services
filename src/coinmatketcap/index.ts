import _axios, { AxiosResponse } from 'axios'
import { ICoinMarketCapQuoteParams, ICoinMarketCapQuoteResponse } from './types'
import { addressToCoinmarketcapId } from './support'
import { isTokenSupported } from '../coinmatketcap/validations'
import { Prices } from '../api/types'

type PricesQueryParams = { addresses: string[], convert: string }

const fromQueryParamsToRequestParams = (params: PricesQueryParams, chaindId: number): ICoinMarketCapQuoteParams => ({
  id: params.addresses
    .filter((address) => isTokenSupported(address, chaindId))
    .map(address => addressToCoinmarketcapId[chaindId][address]).join(','),
  convert: params.convert
})

const fromQuotesResponseToPrices =
  (convert: string, coinmarketcapIdToAddress: Record<string, string>) =>
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
  chainId: number
  coinmarketcapIdToAddress: Record<string, string>

  constructor (
    url: string,
    version: string,
    apiKey: string,
    axios: typeof _axios,
    chainId: number
  ) {
    this.baseURL = `${url}/${version}`
    this.headers = {
      'X-CMC_PRO_API_KEY': apiKey
    }
    this.axios = axios
    this.chainId = chainId
    this.coinmarketcapIdToAddress = Object.keys(addressToCoinmarketcapId[chainId])
      .reduce((p, c) => ({ ...p, [addressToCoinmarketcapId[chainId][c]]: c }), {})
  }

  getQuotesLatest = (queryParams: PricesQueryParams): Promise<Prices> => this.axios.get<ICoinMarketCapQuoteResponse>(
    `${this.baseURL}/cryptocurrency/quotes/latest`, {
      headers: this.headers,
      params: fromQueryParamsToRequestParams(queryParams, this.chainId)
    }).then(fromQuotesResponseToPrices(queryParams.convert!, this.coinmarketcapIdToAddress))
}
