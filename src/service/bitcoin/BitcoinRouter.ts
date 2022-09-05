import express from 'express'
import { HttpsAPI } from '../../controller/httpsAPI'
import BitcoinCore from './BitcoinCore'
const Router = express.Router()

const main = (httpsAPI: HttpsAPI) => {
  Router.get('/getXpubInfo/:xpub', async ({ params: { xpub } }, res, next) => {
    BitcoinCore.getXpubInfo(xpub as string)
      .then(httpsAPI.responseJsonOk(res))
      .catch(next)
  })
  return Router
}
export default main
