import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'

import { PricesQueryParams } from './api/types'

import { CoinMarketCap } from './coinmatketcap'
import { Api } from './rskExplorerApi'
import registeredDapps from './registered_dapps'
import { setupApi } from './api'

const environment = {
  // TODO: remove these defaults
  API_URL:
    (process.env.API_URL as string) ||
    'https://backend.explorer.testnet.rsk.co/api',
  PORT: parseInt(process.env.PORT as string) || 3000,
  CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31,
  COIN_MARKET_CAP_KEY: `${process.env.COIN_MARKET_CAP_KEY}`
}

const app = express()

const api = new Api(environment.API_URL, environment.CHAIN_ID)
const coinMarketCap = new CoinMarketCap(environment.COIN_MARKET_CAP_KEY)

const requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.url)
    next()
  } catch (e: any) {
    console.error(e)
    res.status(400).send(e.toString())
  }
}

app.use(requestMiddleware)

setupApi(app, {
  rskExplorerApi: api,
  coinMarketCapApi: coinMarketCap,
  registeredDapps
})

app.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})
