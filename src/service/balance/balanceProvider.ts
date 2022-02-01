import EventEmitter from 'events'
import { Provider } from '../../util/provider';

export class BalanceProvider extends EventEmitter implements Provider{
  

  constructor() {
    super();
  }

  

  subscribe(address: string): void {
    throw new Error('Method not implemented.');
  }
  unsubscribe(address: string): void {
    throw new Error('Method not implemented.');
  }

}