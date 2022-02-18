import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { PollingProvider } from '../../types/provider'

export class TransactionProvider extends PollingProvider {
  private rskExplorerApi: RSKExplorerAPI
  private address: string
  
  constructor (address: string, rskExplorerApi : RSKExplorerAPI) {
    super()
    this.address = address
    this.rskExplorerApi = rskExplorerApi
  }
  
  async getTransactionsPaginated (address: string, limit?: string, prev?: string, next?: string) {
    return this.rskExplorerApi.getTransactionsByAddress(address, limit, prev, next)
  }
  
  async getTransactions () {
    const { data: transactions } = await this.getTransactionsPaginated(this.address)
    for(const transaction of transactions ) {
      this.emit(this.address, { type: 'newTransaction', payload: transaction })
    }
  }

  subscribe(): void {
    this.getTransactions()
    this.timer = setInterval(() => this.getTransactions(), this.interval)
  }
  unsubscribe(): void {
    this.removeAllListeners(this.address)
    clearInterval(this.timer)
  }
}
