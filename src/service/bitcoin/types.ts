export type BlockbookBalanceResponse = {
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  unconfirmedBalance: string
  unconfirmedTxs: string
  txs: number
  usedTokens: number
  btc: number
}

export interface Vin {
  txid: string
  vout: number
  sequence: number
  n: number
  addresses: string[]
  isAddress: boolean
  value: string
  isOwn?: boolean
}

export interface Vout {
  value: string
  n: number
  spent?: boolean
  hex: string
  addresses: string[]
  isAddress: boolean
  isOwn?: boolean
}

export interface BtcToken {
  type: string
  name: string
  path: string
  transfers: number
  decimals: number
  balance: string
  totalReceived: string
  totalSent: string
}

export interface BtcTransaction {
  txid: string
  version: number
  lockTime: number
  vin: Vin[]
  vout: Vout[]
  blockHash: string
  blockHeight: number
  confirmations: number
  blockTime: number
  value: string
  valueIn: string
  fees: string
  hex: string
}

export interface BlockbookTransactionResponse {
  page: number
  totalPages: number
  itemsOnPage: number
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  unconfirmedBalance: string
  unconfirmedTxs: number
  txs: number
  transactions: BtcTransaction[]
  usedTokens: number
  tokens: BtcToken[]
}

export type BitcoinEvent = {
  type: string
  payload: BlockbookBalanceResponse | BtcTransaction
}

export interface CypherFeeEstimationResult {
  name: string
  height: number
  hash: string
  time: string
  latest_url: string
  previous_hash: string
  previous_url: string
  peer_count: number
  unconfirmed_count: number
  high_fee_per_kb: number
  medium_fee_per_kb: number
  low_fee_per_kb: number
  last_fork_height: number
  last_fork_hash: string
}
