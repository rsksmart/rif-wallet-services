import { Emitter } from './Emitter'
import { BalanceProvider } from '../service/balance/balanceProvider'
import { DataSource } from '../repository/DataSource'

export class BalanceProfiler extends Emitter {
  private address: string
  private balanceProvider: BalanceProvider
  private currentBalance = {}

  constructor (address: string, dataSource: DataSource) {
    super()
    this.address = address
    this.balanceProvider = new BalanceProvider(this.address, dataSource)
  }

  async subscribe (channel: string) {
    this.balanceProvider.on(channel, (data) => {
      const { payload: token } = data
      if (this.currentBalance[token.contractAddress] !== token.balance) {
        this.currentBalance[token.contractAddress] = token.balance
        this.emit(channel, data)
      }
    })
    await this.balanceProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.balanceProvider.unsubscribe()
  }
}
