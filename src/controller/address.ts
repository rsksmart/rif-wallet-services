import { Application, NextFunction, Request, Response } from 'express'
import { PricesQueryParams } from '../api/types'
import { registeredDapps } from '../registered_dapps'
import { Profiler } from '../service/profiler'
import { apiUtil } from '../util/apiUtil'
import { errorHandler } from '../middleware'

export class AddressController {
  private app: Application
  constructor (app: Application) {
    this.app = app
    this.profiler = Profiler.getInstance()
  }

  profiler: Profiler

  init () : void {
    this.app.get('/tokens', (_: Request, res: Response, next: NextFunction) => this.profiler
      .tokenProvider.getTokens()
      .then(apiUtil.responseJsonOk(res))
      .catch(next)
    )

    this.app.get(
      '/address/:address/tokens',
      ({ params: { address } }: Request, res: Response, next: NextFunction) => this.profiler
        .tokenProvider.getTokensByAddress(address)
        .then(apiUtil.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/events',
      ({ params: { address } }: Request, res: Response, next: NextFunction) => this.profiler
        .eventProvider.getEventsByAddress(address)
        .then(apiUtil.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
      '/address/:address/transactions',
      ({ params: { address }, query: { limit, prev, next } }: Request, res: Response, nextFunction: NextFunction) =>
        this.profiler.transactionProvider.getTransactions(address, limit as string, prev as string, next as string)
          .then(apiUtil.responseJsonOk(res))
          .catch(nextFunction)
    )

    this.app.get(
      '/price',
      (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => {
        const addresses = req.query.addresses.split(',')
        this.profiler.priceProvider.getPrices(addresses, req.query.convert)
          .then(apiUtil.responseJsonOk(res))
          .catch(next)
      }
    )

    this.app.get('/dapps', (_: Request, res: Response) => apiUtil.responseJsonOk(res)(registeredDapps))

    this.app.use(errorHandler)
  }
}
