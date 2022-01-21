import 'dotenv/config'
import express from 'express'

import axios from 'axios'
import { CoinMarketCapAPI } from './coinmatketcap'
import { RSKExplorerAPI } from './rskExplorerApi'
import { registeredDapps } from './registered_dapps'
import { setupApi } from './api'
import { Server } from 'socket.io'
import NodeCache from 'node-cache'
import http from 'http'
import pushNewBalances from './subscriptions/pushNewBalances'
import pushNewPrices from './subscriptions/pushNewPrices'
import pushNewTransactions from './subscriptions/pushNewTransactions'
import { errorHandler } from './middleware'

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
const cache = new NodeCache()
setupApi(app, {
  rskExplorerApi,
  coinMarketCapApi,
  registeredDapps,
  cache,
  logger: console,
  chainId: environment.CHAIN_ID
})

app.use(errorHandler)

const server = http.createServer(app)
const io = new Server(server, {
  // cors: {
  //   origin: 'https://amritb.github.io'
  // },
  path: '/ws'
})

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.on('subscribe', ({ address }: { address: string }) => {
    console.log('new subscription with address: ', address)

    const stopPushingNewBalances = pushNewBalances(socket, rskExplorerApi, address)
    const stopPushingNewTransactions = pushNewTransactions(socket, address)
    const stopPushingNewPrices = pushNewPrices(
      socket,
      rskExplorerApi,
      coinMarketCapApi,
      address,
      environment.DEFAULT_CONVERT_FIAT,
      environment.CHAIN_ID
    )

    socket.on('disconnect', () => {
      stopPushingNewBalances()
      stopPushingNewTransactions()
      stopPushingNewPrices()
    })
  })
})

server.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})
