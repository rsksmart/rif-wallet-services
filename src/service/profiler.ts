import { RSKExplorerAPI } from '../rskExplorerApi'
import { Emitter } from '../types/emitter'
import { BalanceProfiler } from '../profiler/balance/balanceProfiler'
import { LastPrice } from './price/lastPrice'
import { PriceProfiler } from '../profiler/price/priceProfiler'
import { TransactionProfiler } from '../profiler/transaction/transactionProfiler'

export class Profiler extends Emitter {
    balanceProfiler: BalanceProfiler;
    transactionProfiler: TransactionProfiler;
    priceProfiler: PriceProfiler;
    lastPrice: LastPrice;
    address: string

    constructor (address: string, rskExplorerApi: RSKExplorerAPI, lastPrice: LastPrice) {
      super()
      this.address = address
      this.lastPrice = lastPrice
      this.balanceProfiler = new BalanceProfiler(address, rskExplorerApi)
      this.transactionProfiler = new TransactionProfiler(address, rskExplorerApi)
      this.priceProfiler = new PriceProfiler(lastPrice)
    }

    subscribe (): void {
      this.priceProfiler.on('prices', (newPrices) => {
        this.emit('prices', newPrices)
      })
      this.priceProfiler.subscribe()

      this.balanceProfiler.on(this.address, (newBalance) => {
        this.emit(this.address, newBalance)
      })
      this.balanceProfiler.subscribe()

      this.transactionProfiler.on(this.address, (newTransaction) => {
        this.emit(this.address, newTransaction)
      })
      this.transactionProfiler.subscribe()
    }

    unsubscribe (): void {
      this.balanceProfiler.unsubscribe()
      this.transactionProfiler.unsubscribe()
      this.priceProfiler.unsubscribe()
    }
}
