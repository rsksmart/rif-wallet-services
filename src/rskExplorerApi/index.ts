import _axios from 'axios'
import { DataSource } from '../repository/DataSource'
import {
  EventsServerResponse,
  TransactionsServerResponse,
  TokensServerResponse,
  RbtcBalancesServerResponse,
  TransactionServerResponse,
  InternalTransactionServerResponse
} from './types'
import { fromApiToRtbcBalance, fromApiToTEvents, fromApiToTokens, fromApiToTokenWithBalance } from './utils'

export class RSKExplorerAPI extends DataSource {
  private chainId: number
  private errorHandling = (e) => {
    console.error(e)
    return []
  }

  constructor (apiURL: string, chainId: number, axios: typeof _axios, id: string) {
    super(apiURL, id, axios)
    this.chainId = chainId
  }

  async getEventsByAddress (address:string, limit?: string) {
    const params = {
      module: 'events',
      action: 'getAllEventsByAddress',
      address: address.toLowerCase(),
      limit
    }
    return this.axios!.get<EventsServerResponse>(this.url, { params })
      .then(response => response.data.data.map(ev => fromApiToTEvents(ev)))
      .catch(this.errorHandling)
  }

  async getInternalTransactionByAddress (address: string, limit?: string) {
    const params = {
      module: 'internalTransactions',
      action: 'getInternalTransactionsByAddress',
      address: address.toLowerCase(),
      limit
    }
    return this.axios!.get<InternalTransactionServerResponse>(this.url, { params })
      .then(response => response.data.data)
      .catch(this.errorHandling)
  }

  async getTokens () {
    const params = {
      module: 'addresses',
      action: 'getTokens'
    }

    return this.axios!.get<TokensServerResponse>(this.url, { params })
      .then(response => response.data.data.filter(t => t.name != null)
        .map(t => fromApiToTokens(t, this.chainId)))
      .catch(this.errorHandling)
  }

  async getTokensByAddress (address:string) {
    const params = {
      module: 'tokens',
      action: 'getTokensByAddress',
      address: address.toLowerCase()
    }

    return this.axios!.get<TokensServerResponse>(this.url, { params })
      .then(response => response.data.data.filter(t => t.name != null)
        .map(t => fromApiToTokenWithBalance(t, this.chainId)))
      .catch(this.errorHandling)
  }

  async getRbtcBalanceByAddress (address:string) {
    const params = {
      module: 'balances',
      action: 'getBalances',
      address: address.toLowerCase()
    }

    return this.axios!.get<RbtcBalancesServerResponse>(this.url, { params })
      .then(response => response.data.data)
      .then(blocks => blocks.reduce((prev, current) => (prev.blockNumber > current.blockNumber) ? prev : current))
      .then(lastBlock => [fromApiToRtbcBalance(lastBlock.balance, this.chainId)])
      .catch(this.errorHandling)
  }

  async getTransaction (hash: string) {
    const params = {
      module: 'transactions',
      action: 'getTransaction',
      hash
    }

    return this.axios!.get<TransactionServerResponse>(this.url, { params })
      .then(response => response.data.data)
      .catch(this.errorHandling)
  }

  async getTransactionsByAddress (
    address:string,
    limit?: string | undefined,
    prev?: string | undefined,
    next?: string | undefined,
    blockNumber: string = '0'
  ) {
    const params = {
      module: 'transactions',
      action: 'getTransactionsByAddress',
      address: address.toLowerCase(),
      limit,
      prev,
      next
    }

    return this.axios!.get<TransactionsServerResponse>(this.url, { params })
      .then(response => response.data)
      .then(transactionPage => {
        return {
          prev: transactionPage.pages.prev,
          next: transactionPage.pages.next,
          data: transactionPage.data.filter(tx => tx.blockNumber >= +blockNumber)
        }
      })
      .catch((e) => {
        console.error(e)
        return {
          prev: null,
          next: null,
          data: []
        }
      })
  }
}
