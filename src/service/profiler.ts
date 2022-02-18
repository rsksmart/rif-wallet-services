import { RSKExplorerAPI } from '../rskExplorerApi';
import { Emitter } from '../types/emitter'
import { BalanceProfiler } from './balance/balanceProfiler'
import { PriceEmitter } from './price/priceEmitter'
import { TransactionProfiler } from './transaction/transactionProfiler'

export class Profiler extends Emitter {
    balanceProfiler: BalanceProfiler;
    transactionProfiler: TransactionProfiler;
    priceEmitter: PriceEmitter;
    address: string

    constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
      super()
      this.address = address
      this.balanceProfiler = new BalanceProfiler(address, rskExplorerApi)
      this.transactionProfiler = new TransactionProfiler(address, rskExplorerApi)
      this.priceEmitter = new PriceEmitter()
    }

    subscribe(): void {
      const emitChange = (data) => {
        this.emit(this.address, data)
      }

      this.balanceProfiler.on(this.address, emitChange)
      this.balanceProfiler.subscribe()

      this.transactionProfiler.on(this.address, emitChange)
      this.transactionProfiler.subscribe()

      this.priceEmitter.on('prices', emitChange)
      this.priceEmitter.subscribe()
    }

    unsubscribe(): void {
      this.balanceProfiler.unsubscribe()
      this.transactionProfiler.unsubscribe()
      this.priceEmitter.unsubscribe()
    }
}
