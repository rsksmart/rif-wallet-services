import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import http from 'http'
import { HttpsAPI } from './controller/httpsAPI'
import { WebSocketAPI } from './controller/webSocketAPI'
import { RSKExplorerAPI } from './rskExplorerApi'
import { CoinMarketCapAPI } from './coinmarketcap'
import { PriceCollector } from './service/price/priceCollector'
import { LastPrice } from './service/price/lastPrice'
import { Server } from 'socket.io'
import { MockPrice } from './service/price/mockPrice'

async function main () {
  const environment = {
    // TODO: remove these defaults
    API_URL:
      (process.env.API_URL as string) ||
      'https://backend.explorer.testnet.rsk.co/api',
    PORT: parseInt(process.env.PORT as string) || 3000,
    CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31,
    COIN_MARKET_CAP_URL: process.env.COIN_MARKET_CAP_URL as string || 'https://pro-api.coinmarketcap.com',
    COIN_MARKET_CAP_VERSION: process.env.COIN_MARKET_CAP_VERSION as string || 'v1',
    COIN_MARKET_CAP_KEY: process.env.COIN_MARKET_CAP_KEY! as string,
    DEFAULT_CONVERT_FIAT: process.env.DEFAULT_CONVERT_FIAT! as string,
    DEFAULT_PRICE_POLLING_TIME: parseInt(process.env.DEFAULT_PRICE_POLLING_TIME as string) || 5 * 60 * 1000
  }

  const rskExplorerApi = new RSKExplorerAPI(environment.API_URL, environment.CHAIN_ID, axios)
  const coinMarketCapApi = new CoinMarketCapAPI(
    environment.COIN_MARKET_CAP_URL,
    environment.COIN_MARKET_CAP_VERSION,
    environment.COIN_MARKET_CAP_KEY,
    axios,
    environment.CHAIN_ID
  )
  const mockPrice = new MockPrice(environment.CHAIN_ID)
  const priceCollector = new PriceCollector(coinMarketCapApi, mockPrice,
    environment.DEFAULT_CONVERT_FIAT, environment.CHAIN_ID, environment.DEFAULT_PRICE_POLLING_TIME)
  const lastPrice = new LastPrice(environment.CHAIN_ID)

  priceCollector.on('prices', (prices) => {
    lastPrice.save(prices)
    lastPrice.emitLastPrice('prices')
  })

  await priceCollector.init()

  const app = express()
  const httpsAPI : HttpsAPI = new HttpsAPI(app, rskExplorerApi, lastPrice)
  httpsAPI.init()

  const server = http.createServer(app)
  const webSocketAPI : WebSocketAPI = new WebSocketAPI(server, rskExplorerApi, lastPrice)
  const io = new Server(server, {
    // cors: {
    //   origin: 'https://amritb.github.io'
    // },
    path: '/ws'
  })
  webSocketAPI.init(io)

  server.listen(environment.PORT, () => {
    console.log(`RIF Wallet services running on port ${environment.PORT}.`)
  })
}

main().catch(e => { console.error(e); process.exit(1) })
