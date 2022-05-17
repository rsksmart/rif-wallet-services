import { RSKExplorerAPI } from '../rskExplorerApi'
import { TransactionProvider } from '../service/transaction/transactionProvider'
import { Emitter } from './Emitter'

export class TransactionProfiler extends Emitter {
  private address: string
  private transactionProvider: TransactionProvider
  private lastReceivedTransactionBlockNumber = -1

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.transactionProvider = new TransactionProvider(address, rskExplorerApi)
  }

  async subscribe (channel: string): Promise<void> {
    await this.transactionProvider.getTransactionsPaginated(this.address.toLowerCase()).then(({ data }) => {
      this.lastReceivedTransactionBlockNumber = data.length ? data[0].blockNumber : -1
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
