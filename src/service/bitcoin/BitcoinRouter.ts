import express from 'express'
import BitcoinCore from './BitcoinCore'
const Router = express.Router()

export const parseQueryString = (query: any) => {
  let parsed = ''
  const keys = ['page', 'pageSize', 'from']
  const queryBuild: Array<string> = []
  for (const key of keys) {
    if (query[key]) queryBuild.push(`${key}=${query[key]}`)
  }
  if (queryBuild.length > 0) parsed = `?${queryBuild.join('&')}`
  return parsed
}

const main = (responseJsonOk, BitcoinCoreInstance: BitcoinCore) => {
  // Parse query for blockbook api
  Router.use((req, res, next) => {
    if (req.query) req.query.parsedQuery = parseQueryString(req.query)
    next()
  })
  Router.get('/getXpubInfo/:xpub', async ({ params: { xpub }, query }, res, next) => {
    BitcoinCoreInstance.getXpubInfo(xpub as string, query?.parsedQuery as string | undefined)
      .then(responseJsonOk(res))
      .catch(next)
  })
  Router.get('/getXpubBalance/:xpub', async ({ params: { xpub } }, res, next) => {
    BitcoinCoreInstance.getXpubBalance(xpub as string)
      .then(responseJsonOk(res))
      .catch(next)
  })
  return Router
}
export default main
