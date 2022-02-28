import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Event } from '../../types/event'
import { PollingProvider } from '../../types/provider'

export class BalanceProvider extends PollingProvider<Event> {
  private rskExplorerApi: RSKExplorerAPI

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.rskExplorerApi = rskExplorerApi
  }

  async poll () {
    const tokens = await this.rskExplorerApi.getTokensByAddress(this.address.toLowerCase())
    return tokens.map(token => new Event('newBalance', token))
  }
}
