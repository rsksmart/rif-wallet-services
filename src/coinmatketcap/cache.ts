import NodeCache from 'node-cache'
import { Prices } from '../api/types'

export const findInCache = (addresses: string[], cache: NodeCache): Prices => {
  let response = {}
  addresses.forEach(address => {
    if (cache.get(address)) {
      response = {
        ...response,
        ...cache.get(address)
      }
    }
  })
  return response
}
