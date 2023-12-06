import { Application, NextFunction, Request, Response, Express } from 'express'
import { PricesQueryParams } from '../api/types'
import { registeredDapps } from '../registered_dapps'
import { errorHandler } from '../middleware'
import { LastPrice } from '../service/price/lastPrice'
import { BitcoinDatasource, RSKDatasource, RSKNodeProvider } from '../repository/DataSource'
import swaggerUI from 'swagger-ui-express'
import OpenApi from '../api/openapi'
import BitcoinRouter from '../service/bitcoin/BitcoinRouter'
import { ValidationError, object, string } from 'yup'
import { utils } from 'ethers'
import { AddressService } from '../service/address/AddressService'

interface HttpsAPIDependencies {
  app: Express,
  dataSourceMapping: RSKDatasource,
  lastPrice: LastPrice,
  bitcoinMapping: BitcoinDatasource,
  providerMapping: RSKNodeProvider
}

export class HttpsAPI {
  private app: Application
  private dataSourceMapping: RSKDatasource
  private lastPrice: LastPrice
  private bitcoinMapping: BitcoinDatasource
  private providerMapping: RSKNodeProvider
  private addressService: AddressService
  constructor (dependencies: HttpsAPIDependencies) {
    this.app = dependencies.app
    this.dataSourceMapping = dependencies.dataSourceMapping
    this.lastPrice = dependencies.lastPrice
    this.bitcoinMapping = dependencies.bitcoinMapping
    this.providerMapping = dependencies.providerMapping
    this.addressService = new AddressService({
      dataSourceMapping: dependencies.dataSourceMapping,
      lastPrice: dependencies.lastPrice,
      providerMapping: dependencies.providerMapping
    })
  }

  responseJsonOk (res: Response) {
    return res.status(200).json.bind(res)
  }

  handleValidationError (e, res: Response) : void {
    if (e instanceof ValidationError) {
      res.status(400).json({ errors: e.errors })
    } else {
      throw e
    }
  }

  init () : void {
    const chainIdSchema = object({
      chainId: string().optional()
        .trim()
        .oneOf(Object.keys(this.dataSourceMapping), 'The current chainId is not supported')
    })
    const addressSchema = object({
      address: string().required('we required a valid address')
        .trim()
        .transform(address => utils.isAddress(address.toLowerCase()) ? address : '')
    }).required()

    this.app.get('/tokens', ({ query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => {
      try {
        chainIdSchema.validateSync({ chainId })
        return this
          .dataSourceMapping[chainId as string].getTokens()
          .then(this.responseJsonOk(res))
          .catch(next)
      } catch (e) {
        this.handleValidationError(e, res)
      }
    })

    this.app.get(
      '/address/:address/tokens',
      async ({ params: { address }, query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => {
        try {
          chainIdSchema.validateSync({ chainId })
          addressSchema.validateSync({ address })
          const balance = await this.addressService.getTokensByAddress({
            chainId: chainId as string,
            address: address as string
          }).catch(next)
          return this.responseJsonOk(res)(balance)
        } catch (e) {
          this.handleValidationError(e, res)
        }
      }
    )

    this.app.get(
      '/address/:address/events',
      ({ params: { address }, query: { chainId = '31' } }: Request, res: Response, next: NextFunction) => {
        try {
          chainIdSchema.validateSync({ chainId })
          addressSchema.validateSync({ address })
          return this
            .dataSourceMapping[chainId as string].getEventsByAddress(address)
            .then(this.responseJsonOk(res))
            .catch(next)
        } catch (e) {
          this.handleValidationError(e, res)
        }
      }
    )

    this.app.get(
      '/address/:address/transactions',
      async ({ params: { address }, query: { limit, prev, next, chainId = '31', blockNumber = '0' } }: Request,
        res: Response, nextFunction: NextFunction) => {
        try {
          chainIdSchema.validateSync({ chainId })
          addressSchema.validateSync({ address })

          const transactions = await this.addressService.getTransactionsByAddress({
            address: address as string,
            chainId: chainId as string,
            limit: limit as string,
            prev: prev as string,
            next: next as string,
            blockNumber: blockNumber as string
          }).catch(nextFunction)
          return this.responseJsonOk(res)(transactions)
        } catch (e) {
          this.handleValidationError(e, res)
        }
      }
    )

    this.app.get(
      '/price',
      async (req: Request<{}, {}, {}, PricesQueryParams>, res: Response, next: NextFunction) => {
        try {
          const prices = await this.addressService.getPrices({
            addresses: req.query.addresses || '',
            convert: req.query.convert || 'USD'
          })
          return this.responseJsonOk(res)(prices)
        } catch (error) {
          next(error)
        }
      }
    )

    this.app.get(
      '/latestPrices',
      async (req, res, next: NextFunction) => {
        try {
          const prices = await this.addressService.getLatestPrices()
          return this.responseJsonOk(res)(prices)
        } catch (error) {
          next(error)
        }
      }
    )

    this.app.get(
      '/address/:address',
      async (req, res, next: NextFunction) => {
        try {
          const { limit, prev, next, chainId = '31', blockNumber = '0' } = req.query
          const { address } = req.params
          const data = await this.addressService.getAddressDetails({
            chainId: chainId as string,
            address,
            blockNumber: blockNumber as string,
            limit: limit as string,
            prev: prev as string,
            next: next as string
          })
          return this.responseJsonOk(res)(data)
        } catch (error) {
          next(error)
        }
      }
    )

    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(OpenApi))
    this.app.use('/bitcoin', BitcoinRouter(this.responseJsonOk, this.bitcoinMapping))
    this.app.get('/dapps', (_: Request, res: Response) => this.responseJsonOk(res)(registeredDapps))

    this.app.use(errorHandler)
  }
}
