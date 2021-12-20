import { addressToCoinmarketcapId, supportedFiat } from './support'

const isTokenSupported = (address: string) => addressToCoinmarketcapId[address] !== undefined
const isConvertSupported = (convert: string) => supportedFiat.includes(convert)

export const validatePricesRequest = (addresses: string[], convert: string) => {
  addresses.forEach(address => { if (!isTokenSupported(address)) throw new Error('Token address not supported') })
  if (!isConvertSupported(convert)) throw new Error('Convert not supported')
}
