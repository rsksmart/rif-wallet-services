import { Application, Request, Response } from 'express'
import { CoinMarketCap } from '../coinmatketcap'
import _registeredDapps from '../registered_dapps'
import { Api } from '../rskExplorerApi'
import { PricesQueryParams } from './types'

export const setupApi = (app: Application, {
  rskExplorerApi, coinMarketCapApi, registeredDapps
}: {
  rskExplorerApi: Api, coinMarketCapApi: CoinMarketCap, registeredDapps: typeof _registeredDapps
}) => {
  app.get('/tokens', (_: Request, res: Response) => rskExplorerApi.getTokens().then(res.status(200).json.bind(res)))

  app.get(
    '/address/:address/tokens',
    ({ params: { address } }: Request, res: Response) => rskExplorerApi.getTokensByAddress(address).then(
      res.status(200).json.bind(res)
    )
  )

  app.get(
    '/address/:address/events',
    ({ params: { address } }: Request, res: Response) => rskExplorerApi.getEventsByAddress(address).then(
      res.status(200).json.bind(res)
    )
  )

  app.get(
    '/address/:address/transactions',
    ({ params: { address }, query: { limit, prev, next } }: Request, res: Response) =>
      rskExplorerApi.getTransactionsByAddress(
        address, limit as string, prev as string, next as string
      ).then(res.status(200).json.bind(res)
      )
  )

  app.get('/price', (req: Request<{}, {}, {}, PricesQueryParams>, res: Response) => coinMarketCapApi.getQuotesLatest(
    req.query
  ).then(res.status(200).json.bind(res)))

  app.get('/dapps', (_: Request, response: Response) => {
    response.status(200).json(registeredDapps)
  })
}
