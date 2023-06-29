import _axios from 'axios'
import { DataSource } from '../repository/DataSource'
import {
  EventsServerResponse,
  TransactionsServerResponse,
  TokensServerResponse,
  IApiRbtcBalance,
  RbtcBalancesServerResponse,
  TransactionServerResponse,
  InternalTransactionServerResponse
} from './types'
import { fromApiToRtbcBalance, fromApiToTEvents, fromApiToTokens, fromApiToTokenWithBalance } from './utils'

export class RSKExplorerAPI extends DataSource {
  private chainId: number

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

    const response = await this.axios!.get<EventsServerResponse>(this.url, { params })
    return response.data.data.map(ev => fromApiToTEvents(ev))
  }

  async getInternalTransactionByAddress (address: string, limit?: string) {
    const params = {
      module: 'internalTransactions',
      action: 'getInternalTransactionsByAddress',
      address,
      limit
    }
    const response = await this.axios!.get<InternalTransactionServerResponse>(this.url, { params })
    return response.data.data
  }

  async getTokens () {
    const params = {
      module: 'addresses',
      action: 'getTokens'
    }

    const response = await this.axios!.get<TokensServerResponse>(this.url, { params })
    return response.data.data
      .filter(t => t.name != null)
      .map(t => fromApiToTokens(t, this.chainId))
  }

  async getTokensByAddress (address:string) {
    const params = {
      module: 'tokens',
      action: 'getTokensByAddress',
      address: address.toLowerCase()
    }

    const response = await this.axios!.get<TokensServerResponse>(this.url, { params })
    return response.data.data
      .filter(t => t.name != null)
      .map(t => fromApiToTokenWithBalance(t, this.chainId))
  }

  async getRbtcBalanceByAddress (address:string) {
    const params = {
      module: 'balances',
      action: 'getBalances',
      address: address.toLowerCase()
    }

    const response = await this.axios!.get<RbtcBalancesServerResponse>(this.url, { params })
    const apiRbtcBalancesByBlocks:IApiRbtcBalance[] = response.data.data

    if (apiRbtcBalancesByBlocks.length === 0) return []

    const balanceInLatestBlock = apiRbtcBalancesByBlocks.reduce(
      (prev, current) => (prev.blockNumber > current.blockNumber) ? prev : current)

    return [fromApiToRtbcBalance(balanceInLatestBlock.balance, this.chainId)]
  }

  async getTransaction (hash: string) {
    const params = {
      module: 'transactions',
      action: 'getTransaction',
      hash
    }

    const response = await this.axios!.get<TransactionServerResponse>(this.url, { params })

    return response.data.data
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
    const { data: response } = await this.axios!.get<TransactionsServerResponse>(this.url, { params })

    const pagesInfo = (response as any).pages

    return {
      prev: pagesInfo.prev,
      next: pagesInfo.next,
      data: response.data.filter(tx => tx.blockNumber >= +blockNumber)
    }
  }
}
