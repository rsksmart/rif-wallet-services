import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Event } from '../../types/event'
import { PollingProvider } from '../../types/provider'

export class TransactionProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi : RSKExplorerAPI) {
    super()
    this.address = address
    this.rskExplorerApi = rskExplorerApi
  }

  async getTransactionsPaginated (address: string, limit?: string, prev?: string, next?: string) {
    return this.rskExplorerApi.getTransactionsByAddress(address, limit, prev, next)
  }

  async poll () {
    const events = await this.getTransactionsPaginated(this.address)
      .then(transactions => transactions.data.map(transaction => new Event('newTransaction', transaction)))
      .catch(() => [])
    return events
  }
}
