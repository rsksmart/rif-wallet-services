import { DataSource } from '../../repository/DataSource'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class TokenTransferProvider extends PollingProvider<Event> {
  private dataSource: DataSource

  constructor (address: string, dataSource: DataSource) {
    super(address)
    this.dataSource = dataSource
  }

  async poll () {
    const events = await this.dataSource.getEventsByAddress(this.address.toLowerCase())
      .then((tokenTransfers) => tokenTransfers.map(tokenTransfer => ({
        type: 'newTokenTransfer',
        payload: tokenTransfer
      })))
      .catch(() => [])
    return events
  }
}
