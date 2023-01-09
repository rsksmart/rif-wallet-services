import {
  IApiEvents,
  IApiTokens,
  IEvent,
  IToken,
  ITokenWithBalance
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
