import { Application, NextFunction, Request, Response } from 'express'
import { PricesQueryParams } from '../api/types'
import { registeredDapps } from '../registered_dapps'
import { errorHandler } from '../middleware'
import { LastPrice } from '../service/price/lastPrice'
import { BitcoinDatasource, RSKDatasource } from '../repository/DataSource'
import swaggerUI from 'swagger-ui-express'
import OpenApi from '../api/openapi'
import BitcoinRouter from '../service/bitcoin/BitcoinRouter'

export class HttpsAPI {
  private app: Application
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private bitcoinMapping: BitcoinDatasource
  constructor (app: Application, dataSourceMapping: RSKDatasource, lastPrice, bitcoinMapping: BitcoinDatasource) {
    this.app = app
    this.dataSourceMapping = dataSourceMapping
    this.lastPrice = lastPrice
    this.bitcoinMapping = bitcoinMapping
  }

  responseJsonOk (res: Response) {
    return res.status(200).json.bind(res)
  }

  init () : void {
    this.app.get('/tokens', ({ query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => this
      .dataSourceMapping[chainId as string].getTokens()
      .then(this.responseJsonOk(res))
      .catch(next)
    )

    this.app.get(
      '/address/:address/tokens',
      ({ params: { address }, query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => this
        .dataSourceMapping[chainId as string].getTokensByAddress(address)
        .then(this.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/events',
      ({ params: { address }, query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => this
        .dataSourceMapping[chainId as string].getEventsByAddress(address)
        .then(this.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/transactions',
      ({ params: { address }, query: { limit, prev, next, chainId = '31', blockNumber = '0' } }: Request,
        res: Response, nextFunction: NextFunction) =>
        this.dataSourceMapping[chainId as string]
          ?.getTransactionsByAddress(address, limit as string, prev as string, next as string, blockNumber as string)
          .then(this.responseJsonOk(res))
          .catch(nextFunction)
    )

    this.app.get(
      '/price',
      (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => {
        const addresses = req.query.addresses.split(',')
        this.lastPrice.getPrices(addresses, req.query.convert)
          .then(this.responseJsonOk(res))
          .catch(next)
      }
    )

    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(OpenApi))
    this.app.use('/bitcoin', BitcoinRouter(this.responseJsonOk, this.bitcoinMapping))
    this.app.get('/dapps', (_: Request, res: Response) => this.responseJsonOk(res)(registeredDapps))

    this.app.use(errorHandler)
  }
}
