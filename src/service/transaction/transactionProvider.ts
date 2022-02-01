import EventEmitter from 'events'
import { Provider } from '../../util/provider';

export class TransactionProvider extends EventEmitter implements Provider {

  constructor() {
    super()
  }

  async getTransactions() {

  }

  subscribe(address: string): void {
      throw new Error('Method not implemented.');
  }
  unsubscribe(address: string): void {
      throw new Error('Method not implemented.');
  }
    
}