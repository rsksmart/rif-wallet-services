import BitcoinCore from '../service/bitcoin/BitcoinCore'
import { BitcoinEvent } from '../service/bitcoin/types'
import { BtcTransactionProvider } from '../service/transaction/btcTransactionProvider'
import { Emitter } from './Emitter'

export class BtcTransactionProfiler extends Emitter {
  private xpub: string
  private transactionProvider: BtcTransactionProvider
  private lastReceivedTransactionBlockNumber = -1

  constructor (xpub: string, dataSource: BitcoinCore) {
    super()
    this.xpub = xpub
    this.transactionProvider = new BtcTransactionProvider(xpub, dataSource)
  }

  async subscribe (channel: string) {
    await this.transactionProvider.getLastTransactionBlockNumber().then((lastBlockNumber) => {
      this.lastReceivedTransactionBlockNumber = lastBlockNumber
    })
    this.transactionProvider.on(channel, (data: BitcoinEvent) => {
      const { payload: transaction } = data
      if ('blockHeight' in transaction && transaction.blockHeight > this.lastReceivedTransactionBlockNumber) {
        this.lastReceivedTransactionBlockNumber = transaction.blockHeight
        this.emit(channel, data)
      }
    })
    this.transactionProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.transactionProvider.unsubscribe()
  }
}
