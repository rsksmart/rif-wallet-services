import axios from "axios";

import {
  ICoinMarketCapResponse,
  ICryptocurrencyMetadata,
  ICryptocurrencyQuota,
  IMetadataParams,
  IQuoteParams,
} from "./types";

export class CoinMarketCap {
  apiKey: string;
  version: string;
  baseURL: string;

  constructor(
    apiKey: string,
    baseURL = "https://pro-api.coinmarketcap.com",
    version = "v1"
  ) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.version = version;
  }

  async getMetadata(params: IMetadataParams) {
    const { data } = await axios.get<
      ICoinMarketCapResponse<Record<string, ICryptocurrencyQuota>>
    >(`${this.baseURL}/${this.version}/cryptocurrency/info`, {
      params,
      headers: {
        "X-CMC_PRO_API_KEY": this.apiKey,
      },
    });
    return data;
  }

  async getQuotesLatest(params?: IQuoteParams) {
    const { data } = await axios.get<
      ICoinMarketCapResponse<ICryptocurrencyQuota>
    >(`${this.baseURL}/${this.version}/cryptocurrency/quotes/latest/`, {
      params,
      headers: {
        "X-CMC_PRO_API_KEY": this.apiKey,
      },
    });
    return data;
  }
}
