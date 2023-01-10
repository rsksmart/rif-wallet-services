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
import { BitcoinDatasource, RSKDatasource, RSKNodeProvider } from './repository/DataSource'
import BitcoinCore from './service/bitcoin/BitcoinCore'
import { ethers } from 'ethers'

async function main () {
  const environment = {
    // TODO: remove these defaults
    NETWORKS: [
      {
        ID: '31',
        API_URL: (process.env.API_URL as string) ||
        'https://backend.explorer.testnet.rsk.co/api',
        CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31,
        BLOCKBOOK_URL: process.env.BLOCKBOOK_URL,
        NODE_URL: process.env.NODE_URL
      },
      {
        ID: '30',
        API_URL: (process.env.API_MAINNET_URL as string) ||
        'https://backend.explorer.rsk.co/api',
        CHAIN_ID: parseInt(process.env.CHAIN_MAINNET_ID as string) || 30,
        BLOCKBOOK_URL: process.env.BLOCKBOOK_MAINNET_URL,
        NODE_URL: process.env.NODE_MAINNET_URL
      }
    ],
    PORT: parseInt(process.env.PORT as string) || 3000,
    COIN_MARKET_CAP_URL: process.env.COIN_MARKET_CAP_URL as string || 'https://pro-api.coinmarketcap.com',
    COIN_MARKET_CAP_VERSION: process.env.COIN_MARKET_CAP_VERSION as string || 'v1',
    COIN_MARKET_CAP_KEY: process.env.COIN_MARKET_CAP_KEY! as string,
    DEFAULT_CONVERT_FIAT: process.env.DEFAULT_CONVERT_FIAT! as string,
    DEFAULT_PRICE_POLLING_TIME: parseInt(process.env.DEFAULT_PRICE_POLLING_TIME as string) || 5 * 60 * 1000,
    BLOCKBOOK_URL: process.env.BLOCKBOOK_URL
  }

  const datasourceMapping: RSKDatasource = {}
  const bitcoinMapping: BitcoinDatasource = {}
  const nodeProvider: RSKNodeProvider = {}
  environment.NETWORKS.forEach(network => {
    datasourceMapping[network.ID] = new RSKExplorerAPI(network.API_URL, network.CHAIN_ID, axios, network.ID)
    bitcoinMapping[network.ID] = new BitcoinCore(network.BLOCKBOOK_URL)
    nodeProvider[network.ID] = new ethers.providers.JsonRpcProvider(network.NODE_URL)
  })
  const coinMarketCapApi = new CoinMarketCapAPI(
    environment.COIN_MARKET_CAP_URL,
    environment.COIN_MARKET_CAP_VERSION,
    environment.COIN_MARKET_CAP_KEY,
    axios
  )
  const mockPrice = new MockPrice()
  const priceCollector = new PriceCollector([coinMarketCapApi, mockPrice],
    environment.DEFAULT_CONVERT_FIAT, environment.DEFAULT_PRICE_POLLING_TIME)
  const lastPrice = new LastPrice()

  priceCollector.on('prices', (prices) => {
    lastPrice.save(prices)
    lastPrice.emitLastPrice('prices')
  })

  await priceCollector.init()

  const app = express()
  const httpsAPI : HttpsAPI = new HttpsAPI(app, datasourceMapping, lastPrice, bitcoinMapping, nodeProvider)
  httpsAPI.init()

  const server = http.createServer(app)
  const webSocketAPI : WebSocketAPI = new WebSocketAPI(server, datasourceMapping, lastPrice, nodeProvider)
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
