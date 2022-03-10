import { RSKExplorerAPI } from '../rskExplorerApi'
import { Emitter } from './Emitter'
import { BalanceProfiler } from './BalanceProfiler'
import { PriceProfiler } from './PriceProfiler'
import { TransactionProfiler } from './TransactionProfiler'
import { LastPrice } from '../service/price/lastPrice'
import { TokenTransferProfiler } from './TokenTransferProfiler'

export class Profiler extends Emitter {
  balanceProfiler: BalanceProfiler;
  transactionProfiler: TransactionProfiler;
  priceProfiler: PriceProfiler;
  lastPrice: LastPrice;
  address: string
  tokenTransferProfiler: TokenTransferProfiler;

  constructor (address: string, rskExplorerApi: RSKExplorerAPI, lastPrice: LastPrice) {
    super()
    this.address = address
    this.lastPrice = lastPrice
    this.balanceProfiler = new BalanceProfiler(address, rskExplorerApi)
    this.transactionProfiler = new TransactionProfiler(address, rskExplorerApi)
    const priceChannel = 'prices'
    this.priceProfiler = new PriceProfiler(lastPrice, priceChannel)
    this.tokenTransferProfiler = new TokenTransferProfiler(address, rskExplorerApi)
  }

  async subscribe () {
    this.priceProfiler.on(this.priceProfiler.channel, (newPrices) => {
      this.emit(this.priceProfiler.channel, newPrices)
    })
    this.priceProfiler.subscribe()

    const balanceChannel = 'balances'
    this.balanceProfiler.on(balanceChannel, (newBalance) => {
      this.emit(balanceChannel, newBalance)
    })
    await this.balanceProfiler.subscribe(balanceChannel)

    const transactionChannel = 'transactions'
    this.transactionProfiler.on(transactionChannel, (newTransaction) => {
      this.emit(transactionChannel, newTransaction)
    })
    await this.transactionProfiler.subscribe(transactionChannel)

    const tokenTransferChannel = 'tokenTransfers'
    this.tokenTransferProfiler.on(tokenTransferChannel, (newTokenTransfer) => {
      this.emit(tokenTransferChannel, newTokenTransfer)
    })
    await this.tokenTransferProfiler.subscribe(tokenTransferChannel)
  }

  unsubscribe (): void {
    this.balanceProfiler.unsubscribe()
    this.transactionProfiler.unsubscribe()
    this.priceProfiler.unsubscribe()
    this.tokenTransferProfiler.unsubscribe()
  }
}
