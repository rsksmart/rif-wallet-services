import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class BalanceProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.rskExplorerApi = rskExplorerApi
  }

  async poll () {
    const events = await this.rskExplorerApi.getTokensByAddress(this.address.toLowerCase())
      .then(tokens => tokens.map(token => new Event('newBalance', token)))
      .catch(() => [])
    return events
  }
}
