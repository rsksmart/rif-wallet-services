import 'dotenv/config'
import express, { Request, Response } from 'express'
import { Api } from './api'
import { CoinMarketCap } from './coinmarketcap'
import { dateToUTCEpoch, isValidAddress } from './utils'
import loki from 'lokijs';


import { IPricesQuery } from "./types"

const environment = { // TODO: remove these defaults
  API_URL: process.env.API_URL as string || 'https://backend.explorer.testnet.rsk.co/api',
  PORT: parseInt(process.env.PORT as string) || 3000,
  CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31,
  COINMARKETCAP_KEY: `${process.env.COINMARKET_KEY}`
}

const app = express()
const api = new Api(environment.API_URL, environment.CHAIN_ID)
const coinMarketCap = new CoinMarketCap(environment.COINMARKETCAP_KEY)

const db = new loki('coinmarketcap');
const requests = db.addCollection('limit');
const limit = requests.insert({counter: 0, lastUpdated: dateToUTCEpoch(new Date), data: {} })

app.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})

app.get('/tokens', async (request: Request, response: Response) => {
  console.log(request.path)
  response.status(200).json(await api.getTokens())
})

app.get('/address/:address/tokens', async (request: Request, response: Response) => {
  console.log(request.path)
  const address = request.params.address
  if (!address) return response.status(404)
  if (isValidAddress(address)) {
    response.status(200).json(await api.getTokensByAddress(address))
  } else {
    response.status(400).send('Invalid address')
  }
})

app.get('/address/:address/events', async (request: Request, response: Response) => {
  console.log(request.path)
  const address = request.params.address
  if (!address) return response.status(404)
  if (isValidAddress(address)) {
    response.status(200).json(await api.getEventsByAddress(address))
  } else {
    response.status(400).send('Invalid address')
  }
})

app.get('/address/:address/transactions', async (request: Request, response: Response) => {
  console.log(request.path)
  const address = request.params.address
  if (!address) return response.status(404)
  if (isValidAddress(address)) {
    response.status(200).json(await api.getTransactionsByAddress(address))
  } else {
    response.status(400).send('Invalid address')
  }
})

app.get('/prices', async (request: Request<{}, {}, {}, IPricesQuery>, response: Response) => {
  const { fiat, symbols } = request.query;
  try {
    const { data } = await coinMarketCap.getQuotesLatest({ symbol: symbols, convert: fiat });

    limit.counter += 1;
    limit.lastUpdated = dateToUTCEpoch(new Date)
    limit.data = data
    requests.update(limit)

    response.status(200).send(data);
  } catch (error) {
    response.status(500).send('Internal error')
  }
});