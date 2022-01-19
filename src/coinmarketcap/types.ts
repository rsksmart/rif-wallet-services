import { Prices } from "../api/types";

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

export interface IPriceCacheSearch {
  missingAddresses: string[];
  pricesInCache: Prices
}