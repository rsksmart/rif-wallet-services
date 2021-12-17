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

export const isValidAddress = (address:string):boolean => {
  return address.startsWith('0x') && address.length === 42 // TODO: maybe check better with a regex
}
