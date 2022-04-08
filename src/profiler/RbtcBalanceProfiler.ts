import { RSKExplorerAPI } from '../rskExplorerApi'
import { Emitter } from './Emitter'
import { RbtcBalanceProvider } from '../service/balance/rbtcBalanceProvider'

export class RbtcBalanceProfiler extends Emitter {
  private address: string
  private rbtcBalanceProvider: RbtcBalanceProvider
  private currentBalance = {}

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.rbtcBalanceProvider = new RbtcBalanceProvider(this.address, rskExplorerApi)
  }

  async subscribe (channel: string) {
    this.rbtcBalanceProvider.on(channel, (data) => {
      console.log({ data })
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
