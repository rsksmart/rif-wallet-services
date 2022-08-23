import { DataSource } from '../../repository/DataSource'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class BalanceProvider extends PollingProvider<Event> {
  private dataSource: DataSource

  constructor (address: string, dataSource: DataSource) {
    super(address)
    this.dataSource = dataSource
  }

  async poll () {
    const events = await this.dataSource.getTokensByAddress(this.address.toLowerCase())
      .then(tokens => tokens.map(token => ({ type: 'newBalance', payload: token })))
      .catch(() => [])
    return events
  }
}
