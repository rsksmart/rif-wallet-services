import { DataSource } from '../../repository/DataSource'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'
import { isMyTransaction } from './utils'

export class TransactionProvider extends PollingProvider<Event> {
  private dataSource: DataSource

  constructor (address: string, dataSource : DataSource) {
    super(address)
    this.dataSource = dataSource
  }

  async getIncomingTransactions (address: string) {
    const events = await this.dataSource.getEventsByAddress(this.address.toLowerCase())
      .then(events => events.filter(event => isMyTransaction(event, address)))
      .catch(() => [])

    const txs = events
      .map(event => this.dataSource.getTransaction(event.transactionHash))

    const result = await Promise.all(txs)
    return result
  }

  async getTransactionsPaginated (address: string, limit?: string, prev?: string, next?: string) {
    return this.dataSource.getTransactionsByAddress(address, limit, prev, next)
  }

  async poll () {
    const txs = await this.getIncomingTransactions(this.address)
      .then(transactions => transactions)
      .catch(() => [])

    const events = await this.getTransactionsPaginated(this.address)
      .then(transactions => [...transactions.data, ...txs]
        .sort((txA, txB) => txA.timestamp - txB.timestamp)
        .map(transaction => ({ type: 'newTransaction', payload: transaction }))
      )
      .catch(() => [])
    return events
  }
}
