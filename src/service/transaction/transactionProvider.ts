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
    const hashes: string[] = await Promise.all([
      this.dataSource.getEventsByAddress(this.address.toLowerCase()),
      this.dataSource.getInternalTransactionByAddress(this.address.toLowerCase())
    ])
      .then(promises =>
        promises.flat()
          .filter(transaction => isMyTransaction(transaction, address))
          .map(transaction => transaction.transactionHash)
      )
      .then((hashes: string[]) => Array.from(new Set(hashes)))
      .catch(() => [])

    return await Promise.all(hashes
      .map(hash => this.dataSource.getTransaction(hash)))
  }

  async getTransactions (address: string, limit?: string, prev?: string, next?: string) {
    return this.dataSource.getTransactionsByAddress(address, limit, prev, next)
  }

  async getLastBlockNumber () : Promise<number> {
    return await Promise.all([
      this.dataSource.getEventsByAddress(this.address.toLowerCase()),
      this.dataSource.getInternalTransactionByAddress(this.address.toLowerCase()),
      this.dataSource.getTransactionsByAddress(this.address.toLowerCase())
    ])
      .then(([events, internalTransactions, { data: transactions }]) => [events, internalTransactions, transactions]
        .flat()
        .map(tx => tx.blockNumber)
        .reduce((a, b) => Math.max(a, b)))
      .catch(() => -1)
  }

  async poll () {
    const txs = await this.getIncomingTransactions(this.address)
      .then(transactions => transactions)
      .catch(() => [])

    const events = await this.getTransactions(this.address)
      .then(transactions => [...transactions.data, ...txs]
        .sort((txA, txB) => txA.timestamp - txB.timestamp)
        .map(transaction => ({ type: 'newTransaction', payload: transaction }))
      )
      .catch(() => [])
    return events
  }
}
