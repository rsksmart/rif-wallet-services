import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Provider } from '../../util/provider'

interface ISentBalances {
  [address: string]: {
    [tokenAddress: string]: string
  }
}
export class BalanceProvider extends EventEmitter implements Provider {
  private rskExplorerApi: RSKExplorerAPI
  private sentBalances: ISentBalances = {}
  private EXECUTION_INTERVAL = 60000
  private timers = {}

  constructor () {
    super()
    this.rskExplorerApi = RSKExplorerAPI.getInstance()
  }

  private async execute (address: string) {
    if (!this.sentBalances[address]) {
      this.sentBalances[address] = {}
    }

    const tokens = await this.rskExplorerApi.getTokensByAddress(address.toLowerCase())
    for (const token of tokens) {
      if (this.sentBalances[address][token.contractAddress] !== token.balance) {
        this.sentBalances[address][token.contractAddress] = token.balance
        this.emit(address, { type: 'newBalance', payload: token })
      }
    }
  }

  subscribe (address: string): void {
    this.execute(address)

    const timer = setInterval(() => this.execute(address), this.EXECUTION_INTERVAL)
    this.timers[address] = timer
  }

  unsubscribe (address: string): void {
    this.removeAllListeners(address)
    clearInterval(this.timers[address])
    this.sentBalances[address] = {}
  }
}
