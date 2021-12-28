import { addressToCoinmarketcapId, supportedFiat } from './support'

export const isTokenSupported = (address: string, chainId: number) => addressToCoinmarketcapId[chainId][address] !== undefined
const isConvertSupported = (convert: string) => supportedFiat.includes(convert)

export const validatePricesRequest = (addresses: string[], convert: string, chainId: number) => {
  addresses.forEach(address => { if (!isTokenSupported(address, chainId)) throw new Error('Token address not supported') })
  if (!isConvertSupported(convert)) throw new Error('Convert not supported')
}
