import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Provider } from '../../util/provider'

export class TransactionProvider extends EventEmitter implements Provider {
  private rskExplorerApi: RSKExplorerAPI

  constructor () {
    super()
    this.rskExplorerApi = RSKExplorerAPI.getInstance()
  }

  async getTransactions (address: string, limit?: string, prev?: string, next?: string) {
    return this.rskExplorerApi.getTransactionsByAddress(address, limit, prev, next)
  }

  subscribe (address: string): void {
    throw new Error('Method not implemented.')
  }

  unsubscribe (address: string): void {
    throw new Error('Method not implemented.')
  }
}
