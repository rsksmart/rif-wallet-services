import { Application, NextFunction, Request, Response } from 'express'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { CoinMarketCapAPI } from '../coinmarketcap'
import { registeredDapps as _registeredDapps } from '../registered_dapps'
import { PricesQueryParams } from './types'
import { isConvertSupported, isTokenSupported } from '../coinmarketcap/validations'
import NodeCache from 'node-cache'
import { findInCache, storeInCache } from '../coinmarketcap/priceCache'
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
  priceCache: NodeCache
  logger?: any
  chainId: number
}

export const setupApi = (app: Application, {
  rskExplorerApi, coinMarketCapApi, registeredDapps, priceCache, logger = { log: () => {}, error: () => {} }, chainId
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
        const addresses = req.query.addresses.split(',').filter((address) => isTokenSupported(address, chainId))
        const convert = req.query.convert

        if (!isConvertSupported(convert)) throw new Error('Convert not supported')

        const isAddressesEmpty = addresses.length === 0
        if (isAddressesEmpty) return ({})

        if (!isConvertSupported(convert)) throw new CustomError(500, 'Convert not supported')

        const { missingAddresses, pricesInCache } = findInCache(addresses, priceCache)
        if (!missingAddresses.length) return pricesInCache.prices

        const prices = coinMarketCapApi.getQuotesLatest({ addresses: missingAddresses, convert })
        return prices.then(pricesFromCMC => {
          storeInCache(pricesFromCMC, priceCache)
          return {
            ...pricesInCache,
            ...pricesFromCMC
          }
        })
      }
    )
  )

  app.get('/dapps', (_: Request, res: Response) => responseJsonOk(res)(registeredDapps))

  app.use(errorHandler)
}
