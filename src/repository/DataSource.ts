import _axios from 'axios'
import { ethers } from 'ethers'
import BitcoinCore from '../service/bitcoin/BitcoinCore'
import { GetEventLogsByAddressAndTopic0 } from '../service/address/AddressService'
import type { IApiTransactions } from '../rskExplorerApi/types'

export abstract class DataSource {
  readonly url: string
  readonly id: string
  readonly axios?: typeof _axios

  constructor (url: string, id: string, axios?: typeof _axios) {
    this.url = url
    this.id = id
    this.axios = axios
  }

  abstract getTokens();
  abstract getTokensByAddress(address: string);
  abstract getRbtcBalanceByAddress(address: string);
  abstract getEventsByAddress(address: string, limit?: string);
  abstract getTransaction(hash: string): Promise<IApiTransactions | null>;
  abstract getInternalTransactionByAddress(address: string, limit?: string);
  abstract getTransactionsByAddress(address:string,
    limit?: string,
    prev?: string,
    next?: string,
    blockNumber?: string);

  abstract getNft(address: string);
  abstract getNftOwnedByAddress(address: string, nft: string);
  abstract getEventLogsByAddressAndTopic0({ address, topic0, toBlock, fromBlock } :
    Omit<GetEventLogsByAddressAndTopic0, 'chainId'>);
}

export type RSKDatasource = {
  [key: string] : DataSource
}

export type RSKNodeProvider = {
  [key: string] : ethers.JsonRpcProvider
}

export type BitcoinDatasource = {
  [key: string] : BitcoinCore
}
