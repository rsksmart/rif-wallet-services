import { BtcBalanceProvider } from '../service/balance/btcBalanceProvider'
import BitcoinCore from '../service/bitcoin/BitcoinCore'
import { Emitter } from './Emitter'

export class BtcBalanceProfiler extends Emitter {
  private xpub: string
  private btcBalanceProvider: BtcBalanceProvider
  private currentBalance = 0

  constructor (xpub: string, dataSource: BitcoinCore) {
    super()
    this.xpub = xpub
    this.btcBalanceProvider = new BtcBalanceProvider(xpub, dataSource)
  }

  async subscribe (channel: string) {
    this.btcBalanceProvider.on(channel, (data) => {
      const { payload: balance } = data
      if (this.currentBalance !== balance.btc) {
        this.currentBalance = balance.btc
        this.emit(channel, data)
      }
    })
    await this.btcBalanceProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.btcBalanceProvider.unsubscribe()
  }
}
