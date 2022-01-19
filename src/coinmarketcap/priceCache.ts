import NodeCache from 'node-cache'
import { Prices } from '../api/types'
import { IPriceCacheSearch } from './types'

export const findInCache = (addresses: string[], cache: NodeCache): IPriceCacheSearch => {
  let response: IPriceCacheSearch = { missingAddresses: [], pricesInCache:{} }
  addresses.forEach(address => {
    if (cache.has(address)) {
      response.pricesInCache = {
        ...response.pricesInCache,
        ...cache.get(address)
      }
    }
  })
  response.missingAddresses = addresses.filter(address => !Object.keys(response.pricesInCache).includes(address))
  return response
}

export const storeInCache = (prices: Prices, cache: NodeCache): void => {
  Object.keys(prices).forEach(address => cache.set(address, { [address]: prices[address] }), 60)

}
