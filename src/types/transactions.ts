export interface IApiTransactionReceipt {
  blockHash?: string
  [key: string]: unknown
}

export interface IApiTransactions {
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  from: string
  to: string
  gas: number
  gasPrice: string
  value: string
  input: string
  timestamp: number
  receipt: IApiTransactionReceipt | null
  txType: string
  txId: string
}
