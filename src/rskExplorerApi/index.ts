import _axios from 'axios'
import { DataSource } from '../repository/DataSource'
import {
  V3PaginatedResponse,
  V3SingleResponse
} from './types'
import {
  fromApiToRtbcBalance,
  fromApiToTokens,
  fromApiToTokenWithBalance,
  fromV3ExplorerEventToIEvent,
  fromV3FullTxToIApiTransactions,
  fromV3InternalTxToIInternalTransaction,
  fromV3SummaryTxToIApiTransactions,
  rbtcExplorerBalanceToHexWei,
  v3HeldTokenToIApiTokens,
  v3ListedTokenToIApiTokens,
  v3PaginationToPage
} from './utils'

const DEFAULT_TAKE = 50

type V3EventPayload = Parameters<typeof fromV3ExplorerEventToIEvent>[0]
type V3ItxPayload = Parameters<typeof fromV3InternalTxToIInternalTransaction>[0]

export class RSKExplorerAPI extends DataSource {
  private chainId: number
  private errorHandling = (e) => {
    console.error(e)
    return []
  }

  constructor (apiURL: string, chainId: number, axios: typeof _axios, id: string) {
    super(apiURL.replace(/\/+$/, ''), id, axios)
    this.chainId = chainId
  }

  private parseTake (limit?: string): number {
    const n = limit != null ? parseInt(limit, 10) : NaN
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_TAKE
  }

  async getEventsByAddress (address:string, limit?: string) {
    const take = this.parseTake(limit)
    const path = `${this.url}/events/address/${encodeURIComponent(address.toLowerCase())}`
    return this.axios!.get<V3PaginatedResponse<V3EventPayload>>(path, { params: { take } })
      .then(response => (response.data.data ?? []).map(ev => fromV3ExplorerEventToIEvent(ev)))
      .catch(this.errorHandling)
  }

  async getInternalTransactionByAddress (address: string, limit?: string) {
    const take = this.parseTake(limit)
    const path = `${this.url}/itxs/address/${encodeURIComponent(address.toLowerCase())}`
    return this.axios!.get<V3PaginatedResponse<V3ItxPayload>>(path, { params: { take } })
      .then(response => (response.data.data ?? []).map(itx => fromV3InternalTxToIInternalTransaction(itx)))
      .catch(this.errorHandling)
  }

  async getTokens () {
    const take = DEFAULT_TAKE
    const path = `${this.url}/tokens`
    return this.axios!.get<V3PaginatedResponse<Record<string, unknown>>>(path, { params: { take } })
      .then(response => (response.data.data ?? [])
        .filter(t => t.name != null && t.decimals != null)
        .map(t => fromApiToTokens(v3ListedTokenToIApiTokens(t as Parameters<typeof v3ListedTokenToIApiTokens>[0]), this.chainId)))
      .catch(this.errorHandling)
  }

  async getTokensByAddress (address:string) {
    const take = DEFAULT_TAKE
    const path = `${this.url}/tokens/address/${encodeURIComponent(address.toLowerCase())}`
    return this.axios!.get<V3PaginatedResponse<Record<string, unknown>>>(path, { params: { take } })
      .then(response => (response.data.data ?? []).filter(t => t.name != null)
        .map(t => fromApiToTokenWithBalance(
          v3HeldTokenToIApiTokens(t as Parameters<typeof v3HeldTokenToIApiTokens>[0]),
          this.chainId)))
      .catch(this.errorHandling)
  }

  async getRbtcBalanceByAddress (address:string) {
    const take = DEFAULT_TAKE
    const path = `${this.url}/balances/address/${encodeURIComponent(address.toLowerCase())}`
    return this.axios!.get<V3PaginatedResponse<{ blockNumber: number, balance: string }>>(path, { params: { take } })
      .then(response => {
        const rows = response.data.data ?? []
        if (rows.length === 0) return []
        const lastBlock = rows.reduce((prev, current) =>
          (prev.blockNumber > current.blockNumber) ? prev : current)
        const weiHex = rbtcExplorerBalanceToHexWei(lastBlock.balance)
        return [fromApiToRtbcBalance(weiHex, this.chainId)]
      })
      .catch(this.errorHandling)
  }

  async getTransaction (hash: string) {
    const path = `${this.url}/txs/${encodeURIComponent(hash)}`
    return this.axios!.get<V3SingleResponse<Record<string, unknown>>>(path)
      .then(response => {
        const row = response.data.data
        if (row == null) return undefined
        return fromV3FullTxToIApiTransactions(row as Parameters<typeof fromV3FullTxToIApiTransactions>[0])
      })
      .catch((e) => {
        console.error(e)
        return undefined
      })
  }

  async getTransactionsByAddress (
    address:string,
    limit?: string | undefined,
    prev?: string | undefined,
    next?: string | undefined,
    blockNumber: string = '0'
  ) {
    const take = this.parseTake(limit)
    const path = `${this.url}/txs/address/${encodeURIComponent(address.toLowerCase())}`
    const cursor = next ?? prev
    const params: { take: number, cursor?: string } = { take }
    if (cursor) params.cursor = cursor

    return this.axios!.get<V3PaginatedResponse<Record<string, unknown>>>(path, { params })
      .then(response => {
        const page = v3PaginationToPage(response.data.paginationData)
        const raw = response.data.data ?? []
        const data = raw.map(row =>
          fromV3SummaryTxToIApiTransactions(row as Parameters<typeof fromV3SummaryTxToIApiTransactions>[0]))
          .filter(tx => tx.blockNumber >= +blockNumber)
        return {
          prev: page.prev,
          next: page.next,
          data
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

  getNft () {
    throw new Error('Feature not supported')
  }

  getNftOwnedByAddress () {
    throw new Error('Feature not supported')
  }

  getEventLogsByAddressAndTopic0 () {
    throw new Error('Feature not supported')
  }
}
