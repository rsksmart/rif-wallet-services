import EventEmitter from 'events'
import { RSKExplorerAPI } from '../../rskExplorerApi'
import { Provider } from '../../util/provider'

export class TransactionProvider extends EventEmitter implements Provider {
  private rskExplorerApi: RSKExplorerAPI
  private EXECUTION_INTERVAL = 60000
  private lastReceivedTransactionBlockNumber = {}
  private timers = {}

  constructor (rskExplorerApi? : RSKExplorerAPI) {
    super()
    this.rskExplorerApi = rskExplorerApi || RSKExplorerAPI.getInstance()
  }

  set interval (time: number) {
    this.EXECUTION_INTERVAL = time
  }

  get interval () {
    return this.EXECUTION_INTERVAL
  }

  async getTransactions (address: string, limit?: string, prev?: string, next?: string) {
    return this.rskExplorerApi.getTransactionsByAddress(address, limit, prev, next)
  }

  private async execute (address: string) {
    const { data } = await this.rskExplorerApi.getTransactionsByAddress(address.toLowerCase())
    // assuming descendent order, if the first transaction has smaller block number
    // than the last sent no transactions are pushed
    const lastReceivedTransactionBlockNumber = this.lastReceivedTransactionBlockNumber[address] || -1
    if (data.length && data[0].blockNumber > lastReceivedTransactionBlockNumber) {
      // push them in historical order
      data.reverse().forEach(transaction => {
        if (transaction.blockNumber > lastReceivedTransactionBlockNumber) {
          // console.log('change', { type: 'newTransaction', payload: transaction })
          this.emit(address, { type: 'newTransaction', payload: transaction })
        }
      })

      // once finished pushing, update to the last transaction sent
      this.lastReceivedTransactionBlockNumber[address] = data[data.length - 1].blockNumber
    }
  }

  subscribe (address: string): void {
    this.execute(address)
    const timer = setInterval(() => this.execute(address), this.EXECUTION_INTERVAL)
    this.timers[address] = timer

    // store the last transaction block number when user subscribes
    this.rskExplorerApi.getTransactionsByAddress(address.toLowerCase()).then(({ data }) => {
      if (data.length) {
        this.lastReceivedTransactionBlockNumber[address] = data[0].blockNumber
      }
    })
  }

  unsubscribe (address: string): void {
    this.removeAllListeners(address)
    clearInterval(this.timers[address])
  }
}
