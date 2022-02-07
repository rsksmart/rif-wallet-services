import { EventEmitter } from 'events'
import { Provider } from '../util/provider'
import { BalanceProvider } from './balance/balanceProvider'
import { EventProvider } from './event/eventProvider'
import { PriceProvider } from './price/priceProvider'
import { TokenProvider } from './token/tokenProvider'
import { TransactionProvider } from './transaction/transactionProvider'

export class Profiler extends EventEmitter implements Provider {
    balanceProvider: BalanceProvider;
    transactionProvider: TransactionProvider;
    priceProvider: PriceProvider;
    tokenProvider: TokenProvider;
    eventProvider: EventProvider;
    private static instance: Profiler;

    constructor () {
      super()
      this.balanceProvider = new BalanceProvider()
      this.priceProvider = new PriceProvider()
      this.transactionProvider = new TransactionProvider()
      this.tokenProvider = new TokenProvider()
      this.eventProvider = new EventProvider()
    }

    public static getInstance (): Profiler {
      if (!Profiler.instance) {
        Profiler.instance = new Profiler()
      }
      return Profiler.instance
    }

    subscribe (address: string): void {
      const emitChange = (data) => {
        this.emit(address, data)
      }

      this.balanceProvider.on(address, emitChange)
      this.balanceProvider.subscribe(address)

      this.transactionProvider.on(address, emitChange)
      this.transactionProvider.subscribe(address)

      this.priceProvider.on(address, emitChange)
      this.priceProvider.subscribe(address)
    }

    unsubscribe (address: string): void {
      this.balanceProvider.unsubscribe(address)
      this.transactionProvider.unsubscribe(address)
      this.priceProvider.unsubscribe(address)
    }
}
