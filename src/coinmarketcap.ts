import axios from "axios";

import { ICoinMarketCapResponse, ICryptocurrency, IQuoteParams } from "./types";

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

  async getQuotesLatest(params?: IQuoteParams) {
    try {
      const { data } = await axios.get<ICoinMarketCapResponse<ICryptocurrency>>(
        `${this.baseURL}/${this.version}/cryptocurrency/quotes/latest/`,
        {
          params,
          headers: {
            "X-CMC_PRO_API_KEY": this.apiKey,
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
