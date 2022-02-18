import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import http from 'http'
import { HttpsAPI } from './controller/httpsAPI'
import { WebSocketAPI } from './controller/webSocketAPI'
import { RSKExplorerAPI } from './rskExplorerApi'
import { CoinMarketCapAPI } from './coinmarketcap'

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
  DEFAULT_CONVERT_FIAT: process.env.DEFAULT_CONVERT_FIAT! as string
}

const rskExplorerApi = new RSKExplorerAPI(environment.API_URL, environment.CHAIN_ID, axios)
const coinMarketCapApi = new CoinMarketCapAPI(
  environment.COIN_MARKET_CAP_URL,
  environment.COIN_MARKET_CAP_VERSION,
  environment.COIN_MARKET_CAP_KEY,
  axios,
  environment.CHAIN_ID
)

const app = express()
const httpsAPI : HttpsAPI = new HttpsAPI(app, rskExplorerApi)
httpsAPI.init()

const server = http.createServer(app)
const webSocketAPI : WebSocketAPI = new WebSocketAPI(server, rskExplorerApi)
webSocketAPI.init()

server.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})
