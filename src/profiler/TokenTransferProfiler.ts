import { RSKExplorerAPI } from '../rskExplorerApi'
import { Emitter } from './Emitter'
import { TokenTransferProvider } from '../service/tokenTransfer/tokenTransferProvider'

export class TokenTransferProfiler extends Emitter {
  private address: string
  private tokenTransferProvider: TokenTransferProvider
  private alreadySent = {}

  constructor (address: string, rskExplorerApi: RSKExplorerAPI) {
    super()
    this.address = address
    this.tokenTransferProvider = new TokenTransferProvider(this.address, rskExplorerApi)
  }

  async subscribe (channel: string) {
    this.tokenTransferProvider.on(channel, (data) => {
      const { payload: tokenTransfer } = data
      if (!this.alreadySent[tokenTransfer.transactionHash]) {
        this.alreadySent[tokenTransfer.transactionHash] = true
        this.emit(channel, data)
      }
    })
    await this.tokenTransferProvider.subscribe(channel)
  }

  unsubscribe (): void {
    this.tokenTransferProvider.unsubscribe()
  }
}
