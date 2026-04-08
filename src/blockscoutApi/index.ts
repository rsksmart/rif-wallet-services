import _axios from 'axios'
import { DataSource } from '../repository/DataSource'
import {
  BalanceServerResponse, InternalTransactionResponse, NFTInstanceResponse,
  ServerResponse, ServerResponseV2, TokenBalanceServerResponse,
  TokenInfoResponse,
  TokenServerResponse, TokenTransferApi, TransactionServerResponse,
  TransactionsServerResponse
} from './types'
import {
  fromApiToInternalTransaction, fromApiToNft, fromApiToNftOwner, fromApiToRtbcBalance, fromApiToTEvents,
  fromApiToTokenWithBalance, fromApiToTokens, fromApiToTransaction,
  type ITransaction
} from './utils'
import type { IApiTransactions } from '../rskExplorerApi/types'
import { GetEventLogsByAddressAndTopic0 } from '../service/address/AddressService'

function blockscoutTransactionToIApi (tx: ITransaction): IApiTransactions {
  return {
    hash: tx.hash,
    nonce: tx.nonce,
    blockHash: tx.blockHash,
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
    from: tx.from,
    to: tx.to ?? '',
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    value: tx.value,
    input: tx.input,
    timestamp: tx.timestamp,
    receipt: tx.receipt,
    txType: tx.txType,
    txId: tx.txId || tx.hash
  }
}

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

  getTransaction (hash: string): Promise<IApiTransactions | null> {
    return this.axios!.get<TransactionServerResponse>(`${this.url}/v2/transactions/${hash}`)
      .then(response => blockscoutTransactionToIApi(fromApiToTransaction(response.data)))
      .catch((e) => {
        console.error(e)
        return null
      })
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
      .catch(e => {
        console.error(e)
        return { data: [] }
      })
  }

  getNft (address: string) {
    return this.axios?.get<TokenInfoResponse>(`${this.url}/v2/tokens/${address.toLowerCase()}`)
      .then(response => (fromApiToNft(response.data)))
      .catch(this.errorHandling)
  }

  async getNftOwnedByAddress (address: string, nft: string) {
    const limit = 10
    let counter = 0
    let items:NFTInstanceResponse[] = []
    const url = `${this.url}/v2/tokens/${nft.toLowerCase()}/instances`
    let response = await this.axios?.get<ServerResponseV2<NFTInstanceResponse>>(url)
      .then(e => {
        items = e.data.items
        return e.data
      })
      .catch(() => ({ items: [], next_page_params: null }))
    if (response && !response.next_page_params) {
      return fromApiToNftOwner(address, response.items)
    }
    while (response && response.next_page_params && counter < limit) {
      counter++
      response = await this.axios?.get<ServerResponseV2<NFTInstanceResponse>>(url,
        { params: response.next_page_params })
        .then(n => {
          items = [...items, ...(n.data.items)]
          return n.data
        }).catch(() => ({ items: [], next_page_params: null }))
    }
    return fromApiToNftOwner(address, [...(response?.items || []), ...items])
  }

  async getEventLogsByAddressAndTopic0 ({
    address, topic0, toBlock = 'latest', fromBlock
  }: Omit<GetEventLogsByAddressAndTopic0, 'chainId'>) {
    let fromBlockToUse = fromBlock
    if (!fromBlock) {
      const tx = await this.getTransactionsByAddress(address)
      // @ts-ignore ignored because it's using never as type
      const lastTx = tx.data.pop() // The last tx is the first transaction

      if (lastTx) fromBlockToUse = lastTx.blockNumber.toString()
    }

    if (!fromBlockToUse) return []
    const params = {
      module: 'logs',
      action: 'getLogs',
      address: address.toLowerCase(),
      toBlock,
      fromBlock: fromBlockToUse,
      topic0
    }
    return this.axios?.get<ServerResponse<TokenTransferApi>>(`${this.url}`, { params })
      .then(({ data }) => data.result)
      .catch(() => [])
  }
}
