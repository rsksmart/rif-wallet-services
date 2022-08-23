import { MockPrice } from '../service/price/mockPrice'
import { addressToCoinmarketcapId, supportedFiat } from './support'

export const isTokenSupported = (address: string) => {
  return addressToCoinmarketcapId[address] !== undefined ||
  MockPrice.prices.includes(address)
}

export const isConvertSupported = (convert: string) => supportedFiat.includes(convert)
