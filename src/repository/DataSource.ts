import _axios from 'axios'

export abstract class DataSource {
  readonly url: string;
  readonly id: string;
  readonly axios?: typeof _axios

  constructor (url: string, id: string, axios?: typeof _axios) {
    this.url = url
    this.id = id
    this.axios = axios
  }

  abstract getTokens();
  abstract getTokensByAddress(address: string);
  abstract getRbtcBalanceByAddress(address: string);
  abstract getEventsByAddress(address: string);
  abstract getTransaction(hash: string);
  abstract getTransactionsByAddress(address:string,
    limit?: string,
    prev?: string,
    next?: string,
    blockNumber?: string);
}
