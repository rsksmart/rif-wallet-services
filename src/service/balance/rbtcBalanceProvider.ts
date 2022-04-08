import { RSKExplorerAPI } from '../../rskExplorerApi'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class RbtcBalanceProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super(address)
    this.rskExplorerApi = rskExplorerApi
  }

  async poll () {
    const events = await this.rskExplorerApi.getRbtcBalanceByAddress(this.address.toLowerCase())
      .then(tokens => tokens.map(token => ({ type: 'newBalance', payload: token })))
      .catch(() => [])
    return events
  }
}
