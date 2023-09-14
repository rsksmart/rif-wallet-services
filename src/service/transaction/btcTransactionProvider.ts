import { PollingProvider } from '../AbstractPollingProvider'
import BitcoinCore from '../bitcoin/BitcoinCore'
import { BitcoinEvent, BlockbookTransactionResponse } from '../bitcoin/types'

export class BtcTransactionProvider extends PollingProvider<BitcoinEvent> {
  private dataSource: BitcoinCore

  constructor (xpub: string, dataSource: BitcoinCore) {
    super(xpub)
    this.dataSource = dataSource
  }

  async getLastTransactionBlockNumber (): Promise<number> {
    return this.dataSource.getXpubTransactions(this.address)
      .then((response: BlockbookTransactionResponse) =>
        response.transactions.length ? response.transactions[0].blockHeight : -1
      )
      .catch(() => -1)
  }

  poll (): Promise<BitcoinEvent[]> {
    return this.dataSource.getXpubTransactions(this.address)
      .then((response: BlockbookTransactionResponse) =>
        response.transactions
          .reverse()
          .map(transaction => ({ type: 'newTransaction', payload: transaction }))
      )
      .catch(() => [])
  }
}
