import { Application, NextFunction, Request, Response } from 'express'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { CoinMarketCapAPI } from '../coinmarketcap'
import { registeredDapps as _registeredDapps } from '../registered_dapps'
import { PricesQueryParams } from './types'
import { isConvertSupported, isTokenSupported } from '../coinmarketcap/validations'
import NodeCache from 'node-cache'
import { findInCache, storeInCache } from '../coinmarketcap/priceCache'
import { errorHandler } from '../middleware'

const responseJsonOk = (res: Response) => res.status(200).json.bind(res)

type APIOptions = {
  rskExplorerApi: RSKExplorerAPI
  coinMarketCapApi: CoinMarketCapAPI
  registeredDapps: typeof _registeredDapps
  priceCache: NodeCache
  logger?: any
  chainId: number
}

export const setupApi = (app: Application, {
  rskExplorerApi, coinMarketCapApi, registeredDapps, priceCache, chainId
}: APIOptions) => {
  app.get('/tokens', (_: Request, res: Response, next: NextFunction) => rskExplorerApi.getTokens()
    .then(res.status(200).json.bind(res))
    .catch(next)
  )

  app.get(
    '/address/:address/tokens',
    ({ params: { address } }: Request, res: Response, next: NextFunction) => rskExplorerApi.getTokensByAddress(address)
      .then(responseJsonOk(res))
      .catch(next)
  )

  app.get(
    '/address/:address/events',
    ({ params: { address } }: Request, res: Response, next: NextFunction) => rskExplorerApi.getEventsByAddress(address)
      .then(responseJsonOk(res))
      .catch(next)
  )

  app.get(
    '/address/:address/transactions',
    ({ params: { address }, query: { limit, prev, next } }: Request, res: Response, nextFunction: NextFunction) =>
      rskExplorerApi.getTransactionsByAddress(
        address, limit as string, prev as string, next as string
      )
        .then(responseJsonOk(res))
        .catch(nextFunction)
  )

  app.get(
    '/price',
    (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => {
      const addresses = req.query.addresses.split(',').filter((address) => isTokenSupported(address, chainId))
      const convert = req.query.convert

      if (!isConvertSupported(convert)) throw new Error('Convert not supported')

      const isAddressesEmpty = addresses.length === 0
      if (isAddressesEmpty) return responseJsonOk(res)({})

      const { missingAddresses, pricesInCache } = findInCache(addresses, priceCache)
      if (!missingAddresses.length) return responseJsonOk(res)(pricesInCache)

      const prices = coinMarketCapApi.getQuotesLatest({ addresses: missingAddresses, convert })
      prices
        .then(pricesFromCMC => {
          storeInCache(pricesFromCMC, priceCache)
          const pricesRes = {
            ...pricesInCache,
            ...pricesFromCMC
          }
          return responseJsonOk(res)(pricesRes)
        })
        .catch(next)
    }
  )

  app.get('/dapps', (_: Request, res: Response) => responseJsonOk(res)(registeredDapps))

  app.use(errorHandler)
}
