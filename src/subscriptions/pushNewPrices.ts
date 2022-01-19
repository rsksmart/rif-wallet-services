import { CoinMarketCapAPI } from '../coinmarketcap'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RSKExplorerAPI } from '../rskExplorerApi/index'
import { Socket } from 'socket.io'
import { isTokenSupported } from '../coinmarketcap/validations'
import NodeCache from 'node-cache'
import { findInCache, storeInCache } from '../coinmarketcap/priceCache'

const EXECUTION_INTERVAL = 60000

const pushNewPrices = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  cmc: CoinMarketCapAPI,
  address: string,
  convert: string,
  chainId: number,
  priceCache: NodeCache
) => {
  const execute = getPricesByToken(socket, api, cmc, address, convert, chainId, priceCache)

  execute()

  const timer = setInterval(execute, EXECUTION_INTERVAL)

  return () => {
    clearInterval(timer)
  }
}

const getPricesByToken = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  cmc: CoinMarketCapAPI,
  address: string,
  convert: string,
  chainId: number,
  priceCache: NodeCache) => async () => {
  const RBTC = '0x0000000000000000000000000000000000000000'
  let addresses = [RBTC, ...(await api.getTokensByAddress(address.toLowerCase()))
    .map(token => token.contractAddress.toLocaleLowerCase())
    .filter(token => isTokenSupported(token, chainId))]

  const isAddressesEmpty = addresses.length === 0

  const { missingAddresses, pricesInCache } = findInCache(addresses, priceCache)
  if(!missingAddresses.length) return pricesInCache
  
  const prices = cmc.getQuotesLatest({ addresses: missingAddresses, convert })
  prices.then(pricesFromCMC => {
    storeInCache(pricesFromCMC, priceCache)
    socket.emit('change', { type: 'newPrice', payload: {...pricesInCache, ...pricesFromCMC} })
  })        

  
}

export default pushNewPrices
