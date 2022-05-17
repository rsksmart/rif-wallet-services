import { addressToCoinmarketcapId, supportedFiat } from './support'

export const isTokenSupported = (address: string, chainId: number) =>
  addressToCoinmarketcapId[chainId][address] !== undefined
export const isConvertSupported = (convert: string) => supportedFiat.includes(convert)
