import 'dotenv/config'
import express from 'express'
import http from 'http'
import { AddressController } from './controller/address'
import { LiveController } from './controller/live'

const environment = {
  PORT: parseInt(process.env.PORT as string) || 3000
}

const app = express()
const addressController : AddressController = new AddressController(app)
addressController.init()

const server = http.createServer(app)
const liveController : LiveController = new LiveController(server)
liveController.init()

server.listen(environment.PORT, () => {
  console.log(`RIF Wallet services running on port ${environment.PORT}.`)
})
