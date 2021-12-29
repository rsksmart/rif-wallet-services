import { CoinMarketCapAPI } from '../coinmatketcap'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RSKExplorerAPI } from '../rskExplorerApi/index'
import { Socket } from 'socket.io'

const EXECUTION_INTERVAL = 60000

const pushNewPrices = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  cmc: CoinMarketCapAPI,
  address: string,
  convert: string
) => {
  const execute = getPricesByToken(socket, api, cmc, address, convert)

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
  convert: string) => async () => {
  let prices = {}
  const addresses = (await api.getTokensByAddress(address.toLowerCase()))
    .map(token => token.contractAddress.toLocaleLowerCase())

  const isAddressesEmpty = addresses.length === 0
  
  if (!isAddressesEmpty) {
    prices = await cmc.getQuotesLatest({ addresses, convert })
  }
  
  socket.emit('change', { type: 'newPrice', payload: prices })
}

export default pushNewPrices
