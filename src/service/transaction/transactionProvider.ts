import { DataSource } from '../../repository/DataSource'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class TransactionProvider extends PollingProvider<Event> {
  private dataSource: DataSource

  constructor (address: string, dataSource : DataSource) {
    super(address)
    this.dataSource = dataSource
  }

  async getTransactionsPaginated (address: string, limit?: string, prev?: string, next?: string) {
    return this.dataSource.getTransactionsByAddress(address, limit, prev, next)
  }

  async poll () {
    const events = await this.getTransactionsPaginated(this.address)
      .then(transactions => transactions.data.map(transaction => ({ type: 'newTransaction', payload: transaction })))
      .catch(() => [])
    return events
  }
}
