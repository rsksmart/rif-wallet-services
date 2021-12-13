import { IApiEvents, IApiTokens, ICoinMarketCapResponse, ICryptocurrencyMetadata, ICryptocurrencyQuota, IEvent, IToken, ITokenWithBalance } from './types'
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

export const sanitizeMetadataResponse = (response: ICoinMarketCapResponse<Record<string, ICryptocurrencyMetadata>>) => {
  const [key] = Object.keys(response.data as Record<string, ICryptocurrencyMetadata>)
  return key
}

export const sanitizeQuotaResponse = (response: ICoinMarketCapResponse<Record<string, ICryptocurrencyQuota>>, fiat: string) => {
  const data = response.data as Record<string, ICryptocurrencyQuota>
  const keys = Object.keys(data)
  return keys.map((id) => ({ name: data[id].name, symbol: data[id].symbol, price: data[id].quote[fiat].price }))
}
