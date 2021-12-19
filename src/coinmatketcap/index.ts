import _axios, { AxiosResponse } from 'axios'
import { ICoinMarketCapQuoteParams, ICoinMarketCapQuoteResponse } from './types'
import { addressToCoinmarketcapId, supportedFiat } from './support'
import { PricesQueryParams, Prices } from '../api/types'

const coinmarketcapIdToAddress = Object.keys(addressToCoinmarketcapId)
  .reduce((p, c) => ({ ...p, [addressToCoinmarketcapId[c]]: c }), {})

const addressesToCoinmarketcapIdWithValidation = (addresses: string) => addresses
  .split(',')
  .map(address => {
    const id = addressToCoinmarketcapId[address.toLowerCase()]
    if (!id) throw new Error('Invalid address')
    return id
  })
  .join(',')

const validateConvert = (convert: string) => {
  const result = convert.toUpperCase()
  if (!supportedFiat.includes(convert)) throw new Error('Invalid convert')
  return result
}

const validateAndConvertRequestParams = (params: PricesQueryParams): ICoinMarketCapQuoteParams => ({
  id: addressesToCoinmarketcapIdWithValidation(params.addresses),
  convert: validateConvert(params.convert)
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

  getQuotesLatest = (queryParams: PricesQueryParams): Promise<Prices> => {
    const params = validateAndConvertRequestParams(queryParams)
    return this.axios.get<ICoinMarketCapQuoteResponse>(
    `${this.baseURL}/cryptocurrency/quotes/latest`, {
      headers: this.headers,
      params
    }).then(fromQuotesResponseToPrices(params.convert!))
  }
}
