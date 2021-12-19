import 'dotenv/config'
import express from 'express'

import axios from 'axios'
import { CoinMarketCapAPI } from './coinmatketcap'
import { RSKExplorerAPI } from './rskExplorerApi'
import { registeredDapps } from './registered_dapps'
import { setupApi } from './api'

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
}

const app = express()

const rskExplorerApi = new RSKExplorerAPI(environment.API_URL, environment.CHAIN_ID, axios)
const coinMarketCapApi = new CoinMarketCapAPI(environment.COIN_MARKET_CAP_URL, environment.COIN_MARKET_CAP_VERSION, environment.COIN_MARKET_CAP_KEY, axios)

setupApi(app, {
  rskExplorerApi,
  coinMarketCapApi,
  registeredDapps,
})

app.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})
