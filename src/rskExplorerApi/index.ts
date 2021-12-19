
import _axios from 'axios'
import { EventsServerResponse, TransactionsServerResponse, TokensServerResponse } from './types'
import { fromApiToTEvents, fromApiToTokens, fromApiToTokenWithBalance } from './utils'

export class RSKExplorerAPI {
    apiURL: string
    chainId: number
    axios: typeof _axios

    constructor (apiURL: string, chainId: number, axios: typeof _axios) {
      this.apiURL = apiURL
      this.chainId = chainId
      this.axios = axios
    }

    async getEventsByAddress (address:string) {
      const params = {
        module: 'events',
        action: 'getAllEventsByAddress',
        address: address.toLowerCase()
      }

      const response = await this.axios.get<EventsServerResponse>(this.apiURL, { params })
      return response.data.data.map(ev => fromApiToTEvents(ev))
    }

    async getTokens () {
      const params = {
        module: 'addresses',
        action: 'getTokens'
      }

      const response = await this.axios.get<TokensServerResponse>(this.apiURL, { params })
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

      const response = await this.axios.get<TokensServerResponse>(this.apiURL, { params })
      return response.data.data
        .filter(t => t.name != null)
        .map(t => fromApiToTokenWithBalance(t, this.chainId))
    }

    async getTransactionsByAddress (
      address:string,
      limit: string | undefined,
      prev: string | undefined,
      next: string | undefined
    ) {
      const params = {
        module: 'transactions',
        action: 'getTransactionsByAddress',
        address: address.toLowerCase(),
        limit,
        prev,
        next
      }
      const response = await this.axios.get<TransactionsServerResponse>(this.apiURL, { params })

      const pagesInfo = (response.data as any).pages

      return {
        prev: pagesInfo.prev,
        next: pagesInfo.next,
        data: response.data.data
      }
    }
}
