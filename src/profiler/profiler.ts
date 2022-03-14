import { RSKExplorerAPI } from '../rskExplorerApi'
import { Emitter } from './Emitter'
import { BalanceProfiler } from './BalanceProfiler'
import { PriceProfiler } from './PriceProfiler'
import { TransactionProfiler } from './TransactionProfiler'
import { LastPrice } from '../service/price/lastPrice'
import { RbtcBalanceProfiler } from './RbtcBalanceProfiler'

export class Profiler extends Emitter {
    balanceProfiler: BalanceProfiler;
    rbtBalanceProfiler: RbtcBalanceProfiler;
    transactionProfiler: TransactionProfiler;
    priceProfiler: PriceProfiler;
    lastPrice: LastPrice;
    address: string

    constructor (address: string, rskExplorerApi: RSKExplorerAPI, lastPrice: LastPrice) {
      super()
      this.address = address
      this.lastPrice = lastPrice
      this.balanceProfiler = new BalanceProfiler(address, rskExplorerApi)
      this.rbtBalanceProfiler = new RbtcBalanceProfiler(address, rskExplorerApi)
      this.transactionProfiler = new TransactionProfiler(address, rskExplorerApi)
      const priceChannel = 'prices'
      this.priceProfiler = new PriceProfiler(lastPrice, priceChannel)
    }

    async subscribe () {
      this.priceProfiler.on(this.priceProfiler.channel, (newPrices) => {
        this.emit(this.priceProfiler.channel, newPrices)
      })
      this.priceProfiler.subscribe()

      const balanceChannel = 'balances'
      this.balanceProfiler.on(balanceChannel, (newBalance) => {
        this.emit(balanceChannel, newBalance)
      })
      await this.balanceProfiler.subscribe(balanceChannel)

      const rbtcBalanceChannel = 'rbtcBalance'
      this.rbtBalanceProfiler.on(balanceChannel, (newBalance) => {
        this.emit(rbtcBalanceChannel, newBalance)
      })
      await this.rbtBalanceProfiler.subscribe(balanceChannel)

      const transactionChannel = 'transactions'
      this.transactionProfiler.on(transactionChannel, (newTransaction) => {
        this.emit(transactionChannel, newTransaction)
      })
      await this.transactionProfiler.subscribe(transactionChannel)
    }

    unsubscribe (): void {
      this.balanceProfiler.unsubscribe()
      this.rbtBalanceProfiler.unsubscribe()
      this.transactionProfiler.unsubscribe()
      this.priceProfiler.unsubscribe()
    }
}
