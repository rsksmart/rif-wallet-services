import NodeCache from 'node-cache'
import { Prices } from '../../api/types'
import { IPriceCacheSearch } from '../../coinmarketcap/types'

export class PriceCache {
  private cache: NodeCache

  constructor (cache?: NodeCache) {
    this.cache = cache ? cache : new NodeCache()
  }

  store (prices: Prices) {
    Object.keys(prices).forEach(address => this.cache.set(address, { [address]: prices[address] }), 60 * 5)
  }

  find (addresses: string[]): IPriceCacheSearch {
    const response: IPriceCacheSearch = { missingAddresses: [], pricesInCache: {} }
    addresses.forEach(address => {
      if (this.cache.has(address)) {
        response.pricesInCache = {
          ...response.pricesInCache,
          ...this.cache.get(address)
        }
      }
    })
    response.missingAddresses = addresses.filter(address => !Object.keys(response.pricesInCache).includes(address))
    return response
  }
}
