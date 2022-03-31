import { RSKExplorerAPI } from '../../rskExplorerApi'
import { IApiTransactions } from '../../rskExplorerApi/types'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'
import { isIncomingTransaction } from './utils'

export class TransactionProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super(address)
    this.rskExplorerApi = rskExplorerApi
  }

  async getIncomingTransactions (address: string) {
    const events = await this.rskExplorerApi.getEventsByAddress(this.address.toLowerCase())
      .then(events => events.filter(event => isIncomingTransaction(event, address)))
      .catch(() => [])

    const txs = events
      .map(event => this.rskExplorerApi.getTransaction(event.transactionHash))

    const result = await Promise.all(txs)
    return result
  }

  async getTransactionsPaginated (address: string, limit?: string, prev?: string, next?: string) {
    return this.rskExplorerApi.getTransactionsByAddress(address, limit, prev, next)
  }

  async poll () {
    const txs: Array<IApiTransactions> = await this.getIncomingTransactions(this.address)
    const events = await this.getTransactionsPaginated(this.address)
      .then(transactions => [...transactions.data, ...txs]
        .sort((txA, txB) => txA.timestamp - txB.timestamp)
        .map(transaction => ({ type: 'newTransaction', payload: transaction }))
      )
      .catch(() => [])
    return events
  }
}
