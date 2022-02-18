import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Emitter } from '../../types/emitter'
import { PollingProvider } from '../../types/provider'

interface ISentBalances {
  [address: string]: {
    [tokenAddress: string]: string
  }
}
export class BalanceProvider extends PollingProvider {
  
  private rskExplorerApi: RSKExplorerAPI
  private address: string
  
  constructor(address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.rskExplorerApi = rskExplorerApi
  }
  
  
  async getBalances() {
    const tokens = await this.rskExplorerApi.getTokensByAddress(this.address.toLowerCase())
    for (const token of tokens) {
      this.emit(this.address, { type: 'newBalance', payload: token })
    }
  }
  
  subscribe(): void {
    this.getBalances()
    this.timer = setInterval(() => this.getBalances(), this.interval)
  }

  unsubscribe(): void {
    this.removeAllListeners(this.address)
    clearInterval(this.timer)
  }

}
