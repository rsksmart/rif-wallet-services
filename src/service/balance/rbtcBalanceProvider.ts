import { ethers } from 'ethers'
import { DataSource } from '../../repository/DataSource'
import { fromApiToRtbcBalance } from '../../rskExplorerApi/utils'
import type { Event } from '../../types/event'
import { PollingProvider } from '../AbstractPollingProvider'

export class RbtcBalanceProvider extends PollingProvider<Event> {
  private dataSource: DataSource
  private provider: ethers.providers.JsonRpcProvider

  constructor (address: string, dataSource: DataSource, provider: ethers.providers.JsonRpcProvider) {
    super(address)
    this.dataSource = dataSource
    this.provider = provider
  }

  async poll () {
    const balance = await this.provider.getBalance(this.address.toLowerCase())
    const rbtcBalance = fromApiToRtbcBalance(balance.toHexString(), parseInt(this.dataSource.id))
    return [{ type: 'newBalance', payload: rbtcBalance }]
  }
}
