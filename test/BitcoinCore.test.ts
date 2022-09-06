import BitcoinCore from '../src/service/bitcoin/BitcoinCore'
import { parseQueryString } from '../src/service/bitcoin/BitcoinRouter'
// eslint-disable-next-line max-len
// const randomMnemonic = 'creek joy sea brain gravity execute month two voyage process bind coffee ecology body depend artwork erode punch episode unfair alpha amount cart clip'
// eslint-disable-next-line max-len
const vpub = 'vpub5Y3owbd2JX4bzwgH4XS5RSRzSnRMX6NYjqkd31sJEB5UGzqkq1v7iASC8R6vbxCWQ1xDDCm63jecwx3fkmv8FWHH5KeQeUyesrdJithe54K'
describe('BitcoinCore unit tests', () => {
  const bitcoinCoreInstance = new BitcoinCore('https://tbtc1.blockbook.bitaccess.net')
  test('Fetch a bitcoin tesnet xpub information', async () => {
    const xpubData = await bitcoinCoreInstance.getXpubInfo(vpub)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent', 'txs']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
  })
  test('Fetch a bitcoin tesnet xpub balance', async () => {
    const xpubData = await bitcoinCoreInstance.getXpubBalance(vpub)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
  })
  test('Fetch a bitcoin tesnet xpub information with page = 1 and pageSize = 10', async () => {
    const queryMock = {
      page: 1,
      pageSize: 10
    }
    const parsedQuery = parseQueryString(queryMock)
    const xpubData = await bitcoinCoreInstance.getXpubInfo(vpub, parsedQuery)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent', 'txs', 'page']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
    expect(xpubData).toHaveProperty('page', 1)
    expect(xpubData).toHaveProperty('itemsOnPage', 10)
  })
})
