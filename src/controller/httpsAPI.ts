import { Application, NextFunction, Request, Response } from 'express'
import { PricesQueryParams } from '../api/types'
import { registeredDapps } from '../registered_dapps'
import { errorHandler } from '../middleware'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { LastPrice } from '../service/price/lastPrice'

export class HttpsAPI {
  private app: Application
  private rskExplorerApi: RSKExplorerAPI
  private lastPrice: LastPrice

  constructor (app: Application, rskExplorerApi: RSKExplorerAPI, lastPrice) {
    this.app = app
    this.rskExplorerApi = rskExplorerApi
    this.lastPrice = lastPrice
  }

  responseJsonOk (res: Response) {
    return res.status(200).json.bind(res)
  }

  init () : void {
    this.app.get('/tokens', (_: Request, res: Response, next: NextFunction) => this
      .rskExplorerApi.getTokens()
      .then(this.responseJsonOk(res))
      .catch(next)
    )

    this.app.get(
      '/address/:address/tokens',
      ({ params: { address } }: Request, res: Response, next: NextFunction) => this
        .rskExplorerApi.getTokensByAddress(address)
        .then(this.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/events',
      ({ params: { address } }: Request, res: Response, next: NextFunction) => this
        .rskExplorerApi.getEventsByAddress(address)
        .then(this.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/transactions',
      ({ params: { address }, query: { limit, prev, next } }: Request, res: Response, nextFunction: NextFunction) =>
        this.rskExplorerApi.getTransactionsByAddress(address, limit as string, prev as string, next as string)
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

    this.app.get('/dapps', (_: Request, res: Response) => this.responseJsonOk(res)(registeredDapps))

    this.app.use(errorHandler)
  }
}
