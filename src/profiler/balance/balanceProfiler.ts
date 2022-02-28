import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Emitter } from '../../types/emitter'
import { BalanceProvider } from '../../service/balance/balanceProvider'

export class BalanceProfiler extends Emitter {
  private address: string
  private balanceProvider: BalanceProvider
  private currentBalance = {}

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.balanceProvider = new BalanceProvider(this.address, rskExplorerApi)
  }

  subscribe (): void {
    this.balanceProvider.on(this.address, (data) => {
      const { payload: token } = data
      if (this.currentBalance[token.contractAddress] !== token.balance) {
        this.currentBalance[token.contractAddress] = token.balance
        this.emit(this.address, data)
      }
    })
    this.balanceProvider.subscribe()
  }

  unsubscribe (): void {
    this.balanceProvider.unsubscribe()
  }
}
