import { Application, Request, Response } from 'express'
import { RSKExplorerAPI } from '../rskExplorerApi'
import { CoinMarketCapAPI } from '../coinmatketcap'
import { registeredDapps as _registeredDapps } from '../registered_dapps'
import { PricesQueryParams } from './types'
import { isConvertSupported, isTokenSupported } from '../coinmatketcap/validations'
import NodeCache from 'node-cache'
import { findInCache } from '../coinmatketcap/cache'

const responseJsonOk = (res: Response) => res.status(200).json.bind(res)

const makeRequestFactory = (console) => async (req, res, query) => {
  try {
    console.log(req.url)
    const result = await query()
    res.status(200).json(result)
  } catch (e: any) {
    console.error(e)
    res.status(500).send(e.message)
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
    async (req: Request<{}, {}, {}, PricesQueryParams>, res: Response) => makeRequest(
      req, res, () => {
        let addresses = req.query.addresses.split(',').filter((address) => isTokenSupported(address, chainId))
        const convert = req.query.convert

        const isAddressesEmpty = addresses.length === 0
        if (isAddressesEmpty) return ({})

        if (!isConvertSupported(convert)) throw new Error('Convert not supported')

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
}
