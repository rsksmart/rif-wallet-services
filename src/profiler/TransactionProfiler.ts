import { DataSource } from '../repository/DataSource'
import { TransactionProvider } from '../service/transaction/transactionProvider'
import { Emitter } from './Emitter'

export class TransactionProfiler extends Emitter {
  private address: string
  private transactionProvider: TransactionProvider
  private lastReceivedTransactionBlockNumber = -1

  constructor (address: string, dataSource: DataSource) {
    super()
    this.address = address
    this.transactionProvider = new TransactionProvider(address, dataSource)
  }

  async subscribe (channel: string): Promise<void> {
    await this.transactionProvider.getLastBlockNumber().then((lastBlockNumber) => {
      this.lastReceivedTransactionBlockNumber = lastBlockNumber
    })
    this.transactionProvider.on(channel, (data) => {
      const { payload: transaction } = data
      if (transaction.blockNumber > this.lastReceivedTransactionBlockNumber) {
        this.lastReceivedTransactionBlockNumber = transaction.blockNumber
        this.emit(channel, data)
      }
    })
    this.transactionProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.transactionProvider.unsubscribe()
  }
}
