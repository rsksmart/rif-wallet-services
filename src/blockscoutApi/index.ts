import _axios from 'axios'
import { DataSource } from '../repository/DataSource'
import {
  BalanceServerResponse, InternalTransactionResponse, ServerResponse, TokenBalanceServerResponse,
  TokenServerResponse, TokenTransferApi, TransactionServerResponse,
  TransactionsServerResponse
} from './types'
import {
  fromApiToInternalTransaction, fromApiToRtbcBalance, fromApiToTEvents,
  fromApiToTokenWithBalance, fromApiToTokens, fromApiToTransaction
} from './utils'

export class BlockscoutAPI extends DataSource {
  private chainId: number
  private errorHandling = (e) => {
    console.error(e)
    return []
  }

  constructor (apiURL: string, chainId: number, axios: typeof _axios, id: string) {
    super(apiURL, id, axios)
    this.chainId = chainId
  }

  getTokens () {
    return this.axios?.get<TokenServerResponse>(`${this.url}/v2/tokens`)
      .then(response => response.data.items
        .map(token => fromApiToTokens(token, this.chainId)))
      .catch(this.errorHandling)
  }

  async getTokensByAddress (address: string) {
    return this.axios?.get<TokenBalanceServerResponse[]>(
      `${this.url}/v2/addresses/${address.toLowerCase()}/token-balances`
    )
      .then(response => response.data.filter(t => t.token.name != null)
        .map(token => {
          token.token.value = token.value
          return fromApiToTokenWithBalance(token.token, this.chainId)
        }))
      .catch(this.errorHandling)
  }

  getRbtcBalanceByAddress (address: string) {
    return this.axios?.get<BalanceServerResponse>(`${this.url}/v2/addresses/${address.toLowerCase()}`)
      .then(response => fromApiToRtbcBalance(response.data.coin_balance, this.chainId))
      .catch(this.errorHandling)
  }

  async getEventsByAddress (address: string) {
    const params = {
      module: 'account',
      action: 'tokentx',
      address: address.toLowerCase()
    }
    return this.axios?.get<ServerResponse<TokenTransferApi>>(`${this.url}`, { params })
      .then(response =>
        response.data.result
          .map(tokenTranfer => {
            return fromApiToTEvents(tokenTranfer)
          }))
      .catch(this.errorHandling)
  }

  getTransaction (hash: string) {
    return this.axios?.get<TransactionServerResponse>(`${this.url}/v2/transactions/${hash}`)
      .then(response =>
        fromApiToTransaction(response.data))
      .catch(this.errorHandling)
  }

  getInternalTransactionByAddress (address: string) {
    return this.axios?.get<InternalTransactionResponse>(
      `${this.url}/v2/addresses/${address.toLowerCase()}/internal-transactions`
    )
      .then(response => response.data.items.map(fromApiToInternalTransaction))
      .catch(this.errorHandling)
  }

  getTransactionsByAddress (address: string) {
    return this.axios?.get<TransactionsServerResponse>(
      `${this.url}/v2/addresses/${address.toLowerCase()}/transactions`
    )
      .then(response => ({ data: response.data.items.map(fromApiToTransaction) }))
      .catch(this.errorHandling)
  }
}
