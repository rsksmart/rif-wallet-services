import { parseEther } from 'ethers'
import {
  IApiEvents,
  IApiTokens,
  IApiTransactions,
  IEvent,
  IInternalTransaction,
  IToken,
  ITokenWithBalance,
  Page,
  V3PaginationData
} from './types'
import tokens from '@rsksmart/rsk-contract-metadata'
import { toChecksumAddress } from '@rsksmart/rsk-utils'

function getLogo (contract:string | null | undefined, chainId:number):string {
  return contract ? tokens[toChecksumAddress(contract, chainId)]?.logo : ''
}

export const fromApiToTokens = (apiToken:IApiTokens, chainId: number): IToken =>
  ({
    name: apiToken.name,
    logo: getLogo(apiToken.address, chainId),
    symbol: apiToken.symbol,
    contractAddress: apiToken.address,
    decimals: parseInt(apiToken.decimals)
  })

export const fromApiToTokenWithBalance = (apiToken:IApiTokens, chainId: number): ITokenWithBalance =>
  ({
    name: apiToken.name,
    logo: getLogo(apiToken.contract, chainId),
    symbol: apiToken.symbol,
    contractAddress: apiToken.contract,
    decimals: parseInt(apiToken.decimals),
    balance: apiToken.balance
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

export const fromApiToTEvents = (apiEvent:IApiEvents): IEvent =>
  ({
    blockNumber: apiEvent.blockNumber,
    event: apiEvent.event,
    timestamp: apiEvent.timestamp,
    topics: apiEvent.topics,
    args: apiEvent.args,
    transactionHash: apiEvent.transactionHash,
    txStatus: apiEvent.txStatus
  })

export function v3PaginationToPage (p?: V3PaginationData): Page {
  if (!p) return { next: null, prev: null }
  const next = p.hasMoreData && p.nextCursor != null && String(p.nextCursor) !== ''
    ? String(p.nextCursor)
    : null
  const prev = p.prevCursor != null && String(p.prevCursor) !== ''
    ? String(p.prevCursor)
    : null
  return { next, prev }
}

/** v3 balances API returns decimal RBTC strings; legacy code expects wei hex. */
export function rbtcExplorerBalanceToHexWei (balance: string): string {
  const s = balance.trim()
  if (s.startsWith('0x') || s.startsWith('0X')) return s
  const wei = parseEther(s)
  return '0x' + wei.toString(16)
}

export function v3ListedTokenToIApiTokens (t: {
  address: string
  name: string
  symbol: string
  balance?: string
  blockNumber: number
  decimals?: number | null
  contract_interface?: string[]
}): IApiTokens {
  return {
    address: t.address,
    balance: String(t.balance ?? '0'),
    blockNumber: t.blockNumber,
    isNative: false,
    name: t.name,
    symbol: t.symbol,
    totalSupply: 0,
    type: 'ERC20',
    contract: t.address,
    contractInterfaces: t.contract_interface ?? [],
    contractMethods: [],
    decimals: String(t.decimals ?? 18)
  }
}

export function v3HeldTokenToIApiTokens (t: {
  address: string
  contract: string
  name: string
  symbol: string
  balance: string
  blockNumber: number
  decimals: number
  contract_interface?: string[]
}): IApiTokens {
  return {
    address: t.address,
    balance: String(t.balance),
    blockNumber: t.blockNumber,
    isNative: false,
    name: t.name,
    symbol: t.symbol,
    totalSupply: 0,
    type: 'ERC20',
    contract: t.contract,
    contractInterfaces: t.contract_interface ?? [],
    contractMethods: [],
    decimals: String(t.decimals)
  }
}

function parseV3ItxReceipt (transaction?: { receipt?: string }): { transactionHash?: string, blockHash?: string } {
  if (!transaction?.receipt) return {}
  try {
    const r = JSON.parse(transaction.receipt) as { transactionHash?: string, blockHash?: string }
    return { transactionHash: r.transactionHash, blockHash: r.blockHash }
  } catch {
    return {}
  }
}

export function fromV3InternalTxToIInternalTransaction (v: {
  internalTxId: string
  blockNumber: number
  timestamp: string
  type: string
  action: { callType: string, from: string, to: string, gas: string, input: string, value: string }
  result?: { gasUsed?: string, gasPrice?: string }
  transaction?: { receipt: string }
}): IInternalTransaction {
  const parsed = parseV3ItxReceipt(v.transaction)
  return {
    _id: v.internalTxId,
    action: {
      callType: v.action.callType,
      from: v.action.from,
      to: v.action.to,
      gas: v.action.gas,
      input: v.action.input,
      value: v.action.value
    },
    blockHash: parsed.blockHash ?? '',
    blockNumber: v.blockNumber,
    transactionHash: parsed.transactionHash ?? '',
    transactionPosition: 0,
    type: v.type,
    subtraces: 0,
    traceAddress: [],
    result: {
      gasUsed: v.result?.gasUsed ?? '0',
      output: ''
    },
    _index: 0,
    timestamp: parseInt(v.timestamp, 10),
    internalTxId: v.internalTxId
  }
}

export function fromV3ExplorerEventToIEvent (e: {
  event: string
  blockNumber: number
  timestamp: string
  transactionHash: string
  topic0?: string | null
  topic1?: string | null
  topic2?: string | null
  topic3?: string | null
  args?: Array<{ name: string, value: string }>
}): IEvent {
  const topics = [e.topic0, e.topic1, e.topic2, e.topic3].filter(
    (t): t is string => t != null && t !== ''
  )
  const args = (e.args ?? []).map(a => a.value)
  return {
    blockNumber: e.blockNumber,
    event: e.event,
    timestamp: parseInt(e.timestamp, 10),
    topics,
    args,
    transactionHash: e.transactionHash,
    txStatus: '0x1'
  }
}

export function fromV3SummaryTxToIApiTransactions (t: {
  txId: string
  hash: string
  blockNumber: number
  from: string
  to?: string
  gas?: number
  gasUsed?: number
  gasPrice?: string
  value?: string
  input?: string
  timestamp: string | number
  transactionIndex: number
  txType: string
  receipt?: IApiTransactions['receipt']
}): IApiTransactions {
  const receipt = t.receipt
  const blockHash = receipt?.blockHash ?? ''
  return {
    hash: t.hash,
    nonce: 0,
    blockHash,
    blockNumber: t.blockNumber,
    transactionIndex: t.transactionIndex,
    from: t.from,
    to: t.to ?? '',
    gas: t.gas ?? t.gasUsed ?? 0,
    gasPrice: String(t.gasPrice ?? '0'),
    value: String(t.value ?? '0'),
    input: t.input ?? '0x',
    timestamp: parseInt(String(t.timestamp), 10),
    receipt,
    txType: t.txType,
    txId: t.txId
  }
}

export function fromV3FullTxToIApiTransactions (t: {
  txId: string
  hash: string
  blockNumber: number
  blockHash?: string
  from: string
  to?: string
  gas: number
  gasPrice?: string | number
  value?: string | number
  input?: string
  timestamp: string | number
  transactionIndex: number
  txType: string
  nonce?: number
  receipt?: IApiTransactions['receipt']
}): IApiTransactions {
  return {
    hash: t.hash,
    nonce: t.nonce ?? 0,
    blockHash: t.blockHash ?? t.receipt?.blockHash ?? '',
    blockNumber: t.blockNumber,
    transactionIndex: t.transactionIndex,
    from: t.from,
    to: t.to ?? '',
    gas: t.gas,
    gasPrice: String(t.gasPrice ?? '0'),
    value: String(t.value ?? '0'),
    input: t.input ?? '0x',
    timestamp: parseInt(String(t.timestamp), 10),
    receipt: t.receipt,
    txType: t.txType,
    txId: t.txId
  }
}
