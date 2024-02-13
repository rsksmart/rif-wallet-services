import {
  IApiToken, ITokenWithBalance, InternalTransaction,
  Token, TokenTransferApi, TransactionServerResponse
} from './types'
import tokens from '@rsksmart/rsk-contract-metadata'
import { toChecksumAddress } from '@rsksmart/rsk-utils'

function getLogo (contract:string | null | undefined, chainId:number):string {
  return contract ? tokens[toChecksumAddress(contract, chainId)]?.logo : ''
}

export interface IEvent {
  blockNumber: number;
  event: string;
  timestamp: number;
  topics: string[];
  args: string[];
  transactionHash: string;
  txStatus: string;
}

export interface Receipt {
  transactionHash: string
  transactionIndex: number
  blockHash: string
  blockNumber: number
  cumulativeGasUsed: number
  gasUsed: number
  contractAddress: any
  logs: any[]
  from: string
  to: string
  status: string
  logsBloom: string
  type: string
}

export interface ITransaction {
  _id: string
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
  v: string
  r: string
  s: string
  type: string
  timestamp: number
  receipt: Receipt
  txType: string
  txId: string
}

export interface IAction {
  callType: string;
  from: string;
  to: string;
  gas: string;
  input: string;
  value: string;
}

export interface IResult {
  gasUsed: string;
  output: string;
}

export interface IInternalTransaction {
  _id: string;
  action: IAction;
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionPosition: number;
  type: string;
  subtraces: number;
  traceAddress: number[];
  result: IResult;
  _index: number;
  timestamp: number;
  internalTxId: string;
}

export interface IToken {
  name: string;
  logo: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
}

export const fromApiToTokens = (apiToken:IApiToken, chainId: number): IToken =>
  ({
    name: apiToken.name,
    logo: getLogo(apiToken.address, chainId),
    symbol: apiToken.symbol,
    contractAddress: apiToken.address.toLowerCase(),
    decimals: parseInt(apiToken.decimals)
  })

export const fromApiToTokenWithBalance = (token:Token, chainId: number): ITokenWithBalance =>
  ({
    name: token.name,
    logo: getLogo(token.address, chainId),
    symbol: token.symbol,
    contractAddress: token.address.toLowerCase(),
    decimals: parseInt(token.decimals),
    balance: token.value
  })

export const fromApiToTEvents = (tokenTransfer:TokenTransferApi): IEvent =>
  ({
    blockNumber: Number(tokenTransfer.blockNumber),
    event: 'transfer',
    timestamp: Date.parse(tokenTransfer.timeStamp) / 1000,
    topics: [],
    args: [tokenTransfer.from, tokenTransfer.to, tokenTransfer.value],
    transactionHash: tokenTransfer.hash,
    txStatus: '0x1'
  })

export const fromApiToTransaction = (transaction: TransactionServerResponse): ITransaction =>
  ({
    _id: '',
    hash: transaction.hash,
    nonce: transaction.nonce,
    blockHash: '',
    blockNumber: transaction.block,
    transactionIndex: 0,
    from: transaction.from.hash,
    to: transaction.to.hash,
    gas: Number(transaction.gas_used),
    gasPrice: transaction.gas_price,
    value: transaction.value,
    input: transaction.raw_input,
    v: '',
    r: '',
    s: '',
    type: String(transaction.type),
    timestamp: Date.parse(transaction.timestamp) / 1000,
    receipt: {
      transactionHash: transaction.hash,
      transactionIndex: 0,
      blockHash: '',
      blockNumber: transaction.block,
      cumulativeGasUsed: Number(transaction.gas_limit),
      gasUsed: Number(transaction.gas_used),
      contractAddress: null,
      logs: [],
      from: transaction.from.hash,
      to: transaction.to.hash,
      status: transaction.status === 'ok' ? '0x1' : '0x0',
      logsBloom: '',
      type: String(transaction.type)
    },
    txType: transaction.tx_types[0],
    txId: ''
  })

export const fromApiToInternalTransaction = (internalTransaction: InternalTransaction): IInternalTransaction =>
  ({
    _id: '',
    action: {
      callType: internalTransaction.type,
      from: internalTransaction.from.hash,
      to: internalTransaction.to.hash,
      value: internalTransaction.value,
      gas: internalTransaction.gas_limit,
      input: '0x'
    },
    blockHash: '',
    blockNumber: internalTransaction.block,
    transactionHash: internalTransaction.transaction_hash,
    transactionPosition: internalTransaction.index,
    type: internalTransaction.type,
    subtraces: 0,
    traceAddress: [],
    result: {
      gasUsed: internalTransaction.gas_limit,
      output: '0x'
    },
    _index: internalTransaction.index,
    timestamp: Date.parse(internalTransaction.timestamp) / 1000,
    internalTxId: ''
  })

export const fromApiToRtbcBalance = (balance:string, chainId: number): ITokenWithBalance =>
  ({
    name: 'RBTC',
    logo: getLogo('0x0000000000000000000000000000000000000000', chainId),
    symbol: 'RBTC',
    contractAddress: '0x0000000000000000000000000000000000000000',
    decimals: parseInt('18'),
    balance
  })
