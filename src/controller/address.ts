import express, { Application, NextFunction, Request, Response } from "express";
import { registeredDapps } from '../registered_dapps'
import { Profiler } from "../service/profiler";
import { apiUtil } from "../util/apiUtil";

export class AddressController {

  private app: Application
  constructor(app: Application) {
    this.app = app
    this.profiler = new Profiler()
  }

  profiler: Profiler


  init() : void {
        
    this.app.get('/v2/tokens', (_: Request, res: Response, next: NextFunction) => this.profiler
        .tokenProvider.getTokens()
        .then(apiUtil.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
        '/v2/address/:address/tokens',
        ({ params: { address } }: Request, res: Response, next: NextFunction) => this.profiler
        .tokenProvider.getTokensByAddress(address)
        .then(apiUtil.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
        '/v2/address/:address/events',
        ({ params: { address } }: Request, res: Response, next: NextFunction) => this.profiler
        .eventProvider.getEventsByAddress(address)
        .then(apiUtil.responseJsonOk(res))
        .catch(next)
    )

    this.app.get(
        '/v2/address/:address/transactions',
        ({ params: { address }, query: { limit, prev, next } }: Request, res: Response, nextFunction: NextFunction) =>
        this.profiler.transactionProvider.getTransactions()
        .then(apiUtil.responseJsonOk(res))
        .catch(nextFunction)
    )

    // this.app.get(
    //     '/v2/price',
    //     (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => {
    //     const addresses = req.query.addresses.split(',').filter((address) => isTokenSupported(address, chainId))
    //     const convert = req.query.convert

    //     if (!isConvertSupported(convert)) throw new Error('Convert not supported')

    //     const isAddressesEmpty = addresses.length === 0
    //     if (isAddressesEmpty) return apiUtil.responseJsonOk(res)({})

    //     const { missingAddresses, pricesInCache } = findInCache(addresses, priceCache)
    //     if (!missingAddresses.length) return apiUtil.responseJsonOk(res)(pricesInCache)

    //     const prices = coinMarketCapApi.getQuotesLatest({ addresses: missingAddresses, convert })
    //     prices
    //         .then(pricesFromCMC => {
    //         storeInCache(pricesFromCMC, priceCache)
    //         const pricesRes = {
    //             ...pricesInCache,
    //             ...pricesFromCMC
    //         }
    //         return apiUtil.responseJsonOk(res)(pricesRes)
    //         })
    //         .catch(next)
    //     }
    // )

    this.app.get('/v2/dapps', (_: Request, res: Response) => apiUtil.responseJsonOk(res)(registeredDapps))



  }
}