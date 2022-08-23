import { Emitter } from './Emitter'
import { TokenTransferProvider } from '../service/tokenTransfer/tokenTransferProvider'
import { DataSource } from '../repository/DataSource'

export class TokenTransferProfiler extends Emitter {
  private address: string
  private tokenTransferProvider: TokenTransferProvider
  private lastReceivedTransactionBlockNumber = -1

  constructor (address: string, dataSource: DataSource) {
    super()
    this.address = address
    this.tokenTransferProvider = new TokenTransferProvider(this.address, dataSource)
  }

  async subscribe (channel: string) {
    this.tokenTransferProvider.on(channel, (data) => {
      const { payload: tokenTransfer } = data

      if (tokenTransfer.blockNumber > this.lastReceivedTransactionBlockNumber) {
        this.lastReceivedTransactionBlockNumber = tokenTransfer.blockNumber
        this.emit(channel, data)
      }
    })
    await this.tokenTransferProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.tokenTransferProvider.unsubscribe()
  }
}
