import express from 'express'
import { BitcoinDatasource } from '../../repository/DataSource'
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

const main = (responseJsonOk, bitcoinMapping: BitcoinDatasource) => {
  // Parse query for blockbook api
  Router.use((req, res, next) => {
    if (req.query) req.query.parsedQuery = parseQueryString(req.query)
    next()
  })
  // Use json
  Router.use(express.json())

  Router.get('/getXpubInfo/:xpub', async ({ params: { xpub }, query: { parsedQuery, chainId = '31' } }, res, next) => {
    bitcoinMapping[chainId as string].getXpubInfo(xpub as string, parsedQuery as string | undefined)
      .then(responseJsonOk(res))
      .catch(next)
  })
  Router.get('/getXpubBalance/:xpub', async ({ params: { xpub }, query: { chainId = '31' } }, res, next) => {
    bitcoinMapping[chainId as string].getXpubBalance(xpub as string)
      .then(responseJsonOk(res))
      .catch(next)
  })

  Router.get('/getNextUnusedIndex/:xpub', async ({
    params: { xpub }, query: { bip, changeIndex = '0', knownLastUsedIndex = '0', chainId = '31', maxIndexesToFetch = '5' }
  }, res, next) => {
    bitcoinMapping[chainId as string].getNextUnusedIndex(
        xpub as string,
        bip as 'BIP44' | 'BIP84',
        changeIndex as string,
        knownLastUsedIndex as string,
        maxIndexesToFetch as string
    ).then(responseJsonOk(res))
      .catch(next)
  })
  Router.get('/getXpubUtxos/:xpub', async ({ params: { xpub }, query: { chainId = '31' } }, res, next) => {
    bitcoinMapping[chainId as string].getXpubUtxos(xpub as string)
      .then(responseJsonOk(res))
      .catch(next)
  })
  Router.get('/sendTransaction/:txhexdata', async ({ params: { txhexdata }, query: { chainId = '31' } }, res, next) => {
    bitcoinMapping[chainId as string].sendTransaction(txhexdata as string)
      .then(responseJsonOk(res))
      .catch(next)
  })
  Router.post('/sendTransaction', async ({ body: { txhexdata = '' }, query: { chainId = '31' } }, res, next) => {
    if (!txhexdata) {
      return res.status(400).json({ error: 'txhexdata is required' })
    }
    bitcoinMapping[chainId as string].sendTransaction(txhexdata as string)
      .then(responseJsonOk(res))
      .catch(next)
  })
  Router.get('/getXpubTransactions/:xpub', async ({
    params: { xpub },
    query: { parsedQuery, chainId = '31' }
  }, res, next) => {
    bitcoinMapping[chainId as string].getXpubTransactions(xpub as string, parsedQuery as string | undefined)
      .then(responseJsonOk(res))
      .catch(next)
  })

  return Router
}
export default main
