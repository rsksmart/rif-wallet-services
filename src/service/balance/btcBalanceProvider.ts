import { PollingProvider } from '../AbstractPollingProvider'
import BitcoinCore from '../bitcoin/BitcoinCore'
import { BitcoinEvent } from '../bitcoin/types'

export class BtcBalanceProvider extends PollingProvider<BitcoinEvent> {
  private dataSource: BitcoinCore

  constructor (xpub: string, dataSource: BitcoinCore) {
    super(xpub)
    this.dataSource = dataSource
  }

  async poll () {
    return this.dataSource.getXpubBalance(this.address)
      .then((response) => [{ type: 'newBalance', payload: response }])
      .catch(() => [])
  }
}
