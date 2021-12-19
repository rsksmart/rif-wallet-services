import { Application, Request, Response, NextFunction, response, query } from 'express'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { CoinMarketCapAPI } from '../coinmatketcap'
import { registeredDapps as _registeredDapps } from '../registered_dapps'
import { PricesQueryParams } from './types'

const responseJsonOk = (res: Response) => res.status(200).json.bind(res)

export const setupApi = (app: Application, {
  rskExplorerApi, coinMarketCapApi, registeredDapps
}: {
  rskExplorerApi: RSKExplorerAPI, coinMarketCapApi: CoinMarketCapAPI, registeredDapps: typeof _registeredDapps
}) => {
  app.get('/tokens', (_: Request, res: Response) => rskExplorerApi.getTokens().then(res.status(200).json.bind(res)))

  app.get(
    '/address/:address/tokens',
    ({ params: { address } }: Request, res: Response) => rskExplorerApi.getTokensByAddress(address)
      .then(responseJsonOk(res))
  )

  app.get(
    '/address/:address/events',
    ({ params: { address } }: Request, res: Response) => rskExplorerApi.getEventsByAddress(address)
      .then(responseJsonOk(res))
  )

  app.get(
    '/address/:address/transactions',
    ({ params: { address }, query: { limit, prev, next } }: Request, res: Response) =>
      rskExplorerApi.getTransactionsByAddress(
        address, limit as string, prev as string, next as string
      )
        .then(responseJsonOk(res))
  )

  app.get(
    '/price',
    async (req: Request<{}, {}, {}, PricesQueryParams>, res: Response) => {
      try {
        const result = await coinMarketCapApi.getQuotesLatest(req.query)
        responseJsonOk(res)(result)
      } catch (e: any) {
        console.error('e', e)
        res.status(500).send(e.message)
      }
    }
  )

  app.get('/dapps', (_: Request, res: Response) => responseJsonOk(res)(registeredDapps))
}
