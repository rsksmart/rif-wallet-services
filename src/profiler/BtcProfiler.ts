import BitcoinCore from '../service/bitcoin/BitcoinCore'
import { BtcBalanceProfiler } from './BtcBalanceProfiler'
import { BtcTransactionProfiler } from './BtcTransactionProfiler'
import { Emitter } from './Emitter'

export class BtcProfiler extends Emitter {
  private xpub: string
  private balanceProfiler: BtcBalanceProfiler
  private transactionProfiler: BtcTransactionProfiler

  constructor (xpub: string, dataSource: BitcoinCore) {
    super()
    this.xpub = xpub
    this.balanceProfiler = new BtcBalanceProfiler(xpub, dataSource)
    this.transactionProfiler = new BtcTransactionProfiler(xpub, dataSource)
  }

  async subscribe () {
    const balanceChannel = 'balances'
    this.balanceProfiler.on(balanceChannel, (newBalance) => {
      this.emit(balanceChannel, newBalance)
    })
    await this.balanceProfiler.subscribe(balanceChannel)

    const transactionChannel = 'transactions'
    this.transactionProfiler.on(transactionChannel, (newTransaction) => {
      this.emit(transactionChannel, newTransaction)
    })
    await this.transactionProfiler.subscribe(transactionChannel)
  }

  unsubscribe (): void {
    this.balanceProfiler.unsubscribe()
    this.transactionProfiler.unsubscribe()
  }
}
