import EventEmitter from 'events'
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

    constructor () {
      super()
      this.balanceProvider = new BalanceProvider()
      this.priceProvider = new PriceProvider()
      this.transactionProvider = new TransactionProvider()
      this.tokenProvider = new TokenProvider()
      this.eventProvider = new EventProvider()
    }

    subscribe (address: string): void {

    }

    unsubscribe (address: string): void {

    }
}
