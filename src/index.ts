import 'dotenv/config'
import express, { Request, Response } from 'express'
import { Api } from './api'
import registeredDapps from './registered_dapps'
import { isValidAddress } from './utils'

const environment = { // TODO: remove these defaults
  API_URL: process.env.API_URL as string || 'https://backend.explorer.testnet.rsk.co/api',
  PORT: parseInt(process.env.PORT as string) || 3000,
  CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31
}

const app = express()
const api = new Api(environment.API_URL, environment.CHAIN_ID)

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
  const { limit, prev, next } = request.query

  if (!address) return response.status(404)
  if (isValidAddress(address)) {
    const result = await api.getTransactionsByAddress(address, limit as string, prev as string, next as string)
    response.status(200).json(result)
  } else {
    response.status(400).send('Invalid address')
  }
})

app.get('/dapps', async (request: Request, response: Response) => {
  response.status(200).json(registeredDapps)
})
