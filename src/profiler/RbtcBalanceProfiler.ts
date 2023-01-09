import { Emitter } from './Emitter'
import { RbtcBalanceProvider } from '../service/balance/rbtcBalanceProvider'
import { DataSource } from '../repository/DataSource'
import { ethers } from 'ethers'

export class RbtcBalanceProfiler extends Emitter {
  private address: string
  private rbtcBalanceProvider: RbtcBalanceProvider
  private currentBalance = {}

  constructor (address: string, dataSource: DataSource, provider: ethers.providers.JsonRpcProvider) {
    super()
    this.address = address
    this.rbtcBalanceProvider = new RbtcBalanceProvider(this.address, dataSource, provider)
  }

  async subscribe (channel: string) {
    this.rbtcBalanceProvider.on(channel, (data) => {
      const { payload: token } = data
      if (this.currentBalance[token.contractAddress] !== token.balance) {
        this.currentBalance[token.contractAddress] = token.balance
        this.emit(channel, data)
      }
    })
    await this.rbtcBalanceProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.rbtcBalanceProvider.unsubscribe()
  }
}
