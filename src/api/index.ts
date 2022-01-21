import { Application, NextFunction, Request, Response } from 'express'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { CoinMarketCapAPI } from '../coinmatketcap'
import { registeredDapps as _registeredDapps } from '../registered_dapps'
import { PricesQueryParams } from './types'
import { isConvertSupported, isTokenSupported } from '../coinmatketcap/validations'
import NodeCache from 'node-cache'
import { findInCache } from '../coinmatketcap/cache'
import { CustomError, errorHandler } from '../middleware'

const responseJsonOk = (res: Response) => res.status(200).json.bind(res)

const makeRequestFactory = (console) => async (req, res, next, query) => {
  try {
    console.log(req.url)
    const result = await query()
    res.status(200).json(result)
  } catch (e: any) {
    console.log(e)
    next(e)
  }
}

type APIOptions = {
  rskExplorerApi: RSKExplorerAPI
  coinMarketCapApi: CoinMarketCapAPI
  registeredDapps: typeof _registeredDapps
  cache: NodeCache
  logger?: any
  chainId: number
}

export const setupApi = (app: Application, {
  rskExplorerApi, coinMarketCapApi, registeredDapps, cache, logger = { log: () => {}, error: () => {} }, chainId
}: APIOptions) => {
  const makeRequest = makeRequestFactory(logger)

  app.get('/tokens', (_: Request, res: Response, next: NextFunction) => rskExplorerApi.getTokens()
    .then(res.status(200).json.bind(res))
    .catch(e => next(new Error(e.message)))
  )

  app.get(
    '/address/:address/tokens',
    ({ params: { address } }: Request, res: Response, next: NextFunction) => rskExplorerApi.getTokensByAddress(address)
      .then(responseJsonOk(res))
      .catch(e => next(new Error(e.message)))
  )

  app.get(
    '/address/:address/events',
    ({ params: { address } }: Request, res: Response, next: NextFunction) => rskExplorerApi.getEventsByAddress(address)
      .then(responseJsonOk(res))
      .catch(e => next(new Error(e.message)))
  )

  app.get(
    '/address/:address/transactions',
    ({ params: { address }, query: { limit, prev, next } }: Request, res: Response, nextFunction: NextFunction) =>
      rskExplorerApi.getTransactionsByAddress(
        address, limit as string, prev as string, next as string
      )
        .then(responseJsonOk(res))
        .catch(e => nextFunction(new Error(e.message)))
  )

  app.get(
    '/price',
    async (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => makeRequest(
      req, res, next, () => {
        let addresses = req.query.addresses.split(',').filter((address) => isTokenSupported(address, chainId))
        const convert = req.query.convert

        if (!isConvertSupported(convert)) throw new CustomError(500, 'Convert not supported')

        const isAddressesEmpty = addresses.length === 0
        if (isAddressesEmpty) return ({})

        const pricesInCache = findInCache(addresses, cache)
        addresses = addresses.filter(address => !Object.keys(pricesInCache).includes(address))
        let prices = {}
        if (addresses.length) {
          prices = coinMarketCapApi.getQuotesLatest({ addresses, convert })
        }
        return Promise.all([pricesInCache, prices]).then(values => {
          Object.keys(values[1]).forEach(address => cache.set(address, { [address]: values[1][address] }, 60))
          return {
            ...values[0],
            ...values[1]
          }
        })
      }
    )
  )

  app.get('/dapps', (_: Request, res: Response) => responseJsonOk(res)(registeredDapps))

  app.use(errorHandler)
}
