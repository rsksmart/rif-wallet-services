import { MockPrice } from '../service/price/mockPrice'
import { addressToCoinmarketcapId, supportedFiat } from './support'

export const isTokenSupported = (address: string, chainId: number) => {
  return addressToCoinmarketcapId[chainId][address] !== undefined ||
  MockPrice.prices[chainId].includes(address)
}

export const isConvertSupported = (convert: string) => supportedFiat.includes(convert)
