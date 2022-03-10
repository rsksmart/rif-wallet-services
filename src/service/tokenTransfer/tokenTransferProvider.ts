import { RSKExplorerAPI } from '../../rskExplorerApi'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class TokenTransferProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super(address)
    this.rskExplorerApi = rskExplorerApi
  }

  async poll () {
    const events = await this.rskExplorerApi.getEventsByAddress(this.address.toLowerCase())
      .then((tokenTransfers) => tokenTransfers.map(tokenTransfer => ({
        type: 'newTokenTransfer',
        payload: tokenTransfer
      })))
      .catch(() => [])
    return events
  }
}
