import axios, { AxiosResponse } from 'axios'

export interface ICoinMarketCapQuoteParams {
  id?: string;
  slug?: string;
  symbol?: string;
  convert?: string;
  'convert_id'?: string;
  aux?: string;
  'skip_invalid'?: boolean;
}

interface IFiat {
  price: number;
  'volume_24h': number;
  'volume_change_24h': number;
  'percent_change_1h': number;
  'percent_change_24h': number;
  'percent_change_7d': number;
  'percent_change_30d': number;
  'percent_change_60d': number;
  'percent_change_90d': number;
  'market_cap': number;
  'market_cap_dominance': number;
  'fully_diluted_market_cap': number;
  'last_updated': string;
}

interface IPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  'token_address': string;
}

interface IStatus {
  timestamp: string;
  'error_code': number;
  'error_message': string | null;
  elapsed: number;
  'credit_count': string;
  notice: string | null;
}

interface ICryptocurrencyQuota {
  id: string;
  name: string;
  symbol: string;
  slug: string;
  'num_market_pairs': string | null;
  'date_added': string;
  tags: Array<string>;
  'max_supply': number | null;
  'circulating_supply': number | null;
  'total_supply': number | null;
  platform: IPlatform | null;
  'is_active': 0 | 1;
  'cmc_rank': number | null;
  'is_fiat': 0 | 1;
  'last_updated': string;
  quote: Record<string, IFiat>;
}

export interface ICoinMarketCapQuoteResponse {
  status: IStatus;
  data: ICryptocurrencyQuota;
}

const addressToCoinmarketcapId = {
  '0x0000000000000000000000000000000000000000': '3626', // RBTC
  '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5': '3701'
}

const supportedFiat = ['USD']

const coinmarketcapIdToAddress = Object.keys(addressToCoinmarketcapId)
  .reduce((p, c) => ({ ...p, [addressToCoinmarketcapId[c]]: c }), {})

export type QueryParams = { addresses: string, convert: string }
export type Prices = { [address: string]: {
  price: number,
  lastUpdated: string
} }

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

const validateAndConvertRequestParams = (params: QueryParams): ICoinMarketCapQuoteParams => ({
  id: addressesToCoinmarketcapIdWithValidation(params.addresses),
  convert: validateConvert(params.convert)
})

const fromQuotesResponseToPrices = (convert: string) => (response: AxiosResponse<ICoinMarketCapQuoteResponse>) => Object.keys(response.data.data).reduce<Prices>((p, c) => ({
  ...p,
  [coinmarketcapIdToAddress[c]]: {
    price: response.data.data[c].quote[convert].price,
    lastUpdated: response.data.data[c].last_updated
  }
}), {})

export class CoinMarketCap {
  headers: { 'X-CMC_PRO_API_KEY': string }
  baseURL: string

  constructor (
    apiKey: string,
    url = 'https://pro-api.coinmarketcap.com',
    version = 'v1'
  ) {
    this.baseURL = `${url}/${version}`
    this.headers = {
      'X-CMC_PRO_API_KEY': apiKey
    }
  }

  getQuotesLatest = (params: QueryParams): Promise<Prices> => axios.get<ICoinMarketCapQuoteResponse>(
    `${this.baseURL}/cryptocurrency/quotes/latest`, {
      headers: this.headers,
      params: validateAndConvertRequestParams(params)
    }).then(fromQuotesResponseToPrices(params.convert))
}
