import 'dotenv/config'
import express, { Request, Response } from 'express'
import { Api } from './api'
import registeredDapps from './registered_dapps'
import { isValidAddress } from './utils'
import { Server } from 'socket.io'
import http from 'http'
import pushNewBalances from './subscriptions/pushNewBalances'

const environment = { // TODO: remove these defaults
  API_URL: process.env.API_URL as string || 'https://backend.explorer.testnet.rsk.co/api',
  PORT: parseInt(process.env.PORT as string) || 3000,
  CHAIN_ID: parseInt(process.env.CHAIN_ID as string) || 31
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  path: '/ws',
  cors: {
    origin: 'https://amritb.github.io'
  } // TODO: remove cors, it's just for testing proposes
})

const api = new Api(environment.API_URL, environment.CHAIN_ID)

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.on('subscribe', ({ address }: { address: string }) => {
    console.log('new subscription with address: ', address)

    pushNewBalances(socket, api, address)
  })
})

server.listen(environment.PORT, () => {
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
