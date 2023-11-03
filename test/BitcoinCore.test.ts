import BitcoinCore from '../src/service/bitcoin/BitcoinCore'
import { parseQueryString } from '../src/service/bitcoin/BitcoinRouter'
import 'dotenv/config'
import axios from 'axios'
jest.mock('axios')
// eslint-disable-next-line max-len
// const randomMnemonic = 'creek joy sea brain gravity execute month two voyage process bind coffee ecology body depend artwork erode punch episode unfair alpha amount cart clip'
// eslint-disable-next-line max-len
const API_URL = process.env.BLOCKBOOK_URL
const CYPHER_ESTIMATE_FEE_URL = process.env.CYPHER_ESTIMATE_FEE_URL
const vpub = 'vpub5Y3owbd2JX4bzwgH4XS5RSRzSnRMX6NYjqkd31sJEB' +
  '5UGzqkq1v7iASC8R6vbxCWQ1xDDCm63jecwx3fkmv8FWHH5KeQeUyesrdJithe54K'

describe('BitcoinCore unit tests', () => {
  const bitcoinCoreInstance = new BitcoinCore({
    BLOCKBOOK_URL: API_URL,
    axiosInstance: axios,
    CYPHER_ESTIMATE_FEE_URL
  })
  test('Fetch a bitcoin testnet xpub information', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        balance: 0, btc: 0, address: '', totalReceived: 0, totalSent: 0, txs: []
      }
    })
    const xpubData = await bitcoinCoreInstance.getXpubInfo(vpub)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent', 'txs']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
  })
  test('Fetch a bitcoin testnet xpub balance', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        balance: 0, btc: 0, address: '', totalReceived: 0, totalSent: 0
      }
    })
    const xpubData = await bitcoinCoreInstance.getXpubBalance(vpub)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
  })
  test('Fetch a bitcoin testnet xpub information with page = 1 and pageSize = 10', async () => {
    const queryMock = {
      page: 1,
      pageSize: 10
    };
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        balance: 0, btc: 0, address: '', totalReceived: 0, totalSent: 0, txs: [], page: 1, itemsOnPage: 10
      }
    })

    const parsedQuery = parseQueryString(queryMock)
    const xpubData = await bitcoinCoreInstance.getXpubInfo(vpub, parsedQuery)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent', 'txs', 'page']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
    expect(xpubData).toHaveProperty('page', 1)
    expect(xpubData).toHaveProperty('itemsOnPage', 10)
  })

  test('Fetch next available index for change index 0, known used index 0', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        tokens: [
          {
            path: "m/84'/1'/0'/0/0",
            name: 'test'
          },
          {
            path: "m/84'/1'/0'/0/1",
            name: 'test'
          }
        ]
      }
    })
    const index = await bitcoinCoreInstance.getNextUnusedIndex(vpub, 'BIP84', '0', '0')
    expect(index).toEqual({ index: 2, availableIndexes: [2, 3, 4, 5, 6] })
  })

  test('Fetch next available index for change index 1, known used index 9', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        tokens: [
          {
            path: "m/84'/1'/0'/1/5",
            name: 'test'
          },
          {
            path: "m/84'/1'/0'/1/9",
            name: 'test'
          }
        ]
      }
    })
    const index = await bitcoinCoreInstance.getNextUnusedIndex(vpub, 'BIP84', '1', '9')
    expect(index).toEqual({ index: 10, availableIndexes: [10, 11, 12, 13, 14] })
  })

  test('Should estimate fee from blockbook API', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { result: 'feeRate' }
    })

    const feeEstimation = await bitcoinCoreInstance.estimateFee('blockbook', 6)

    // Validate the response format
    expect(feeEstimation).toHaveProperty('result', 'feeRate')
    expect(feeEstimation).toEqual({ result: 'feeRate' })
  })

  test('Should estimate fee from cypher API when not cached', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { fee: 'estimatedFee', timeCached: Date.now() }
    })

    const feeEstimation = await bitcoinCoreInstance.estimateFee('cypher')

    // Check if the timeCached property is set correctly
    expect(feeEstimation).toHaveProperty('fee', 'estimatedFee')
    expect(feeEstimation).toHaveProperty('timeCached')
  })

  test('Should return cached fee from cypher API if still valid', async () => {
    // Set a cached result that would still be valid
    bitcoinCoreInstance.currentCypherResult = {
      timeCached: Date.now() + 10000,
      name: 'test',
      height: 100,
      hash: 'asd',
      time: Date.now().toString(),
      latest_url: 'test',
      previous_hash: 'test',
      previous_url: 'test',
      peer_count: 1,
      unconfirmed_count: 1,
      high_fee_per_kb: 1,
      medium_fee_per_kb: 1,
      low_fee_per_kb: 1,
      last_fork_height: 1,
      last_fork_hash: 'test'
    }

    const feeEstimation = await bitcoinCoreInstance.estimateFee('cypher')
    jest.clearAllMocks()
    // Ensure axios.get was not called since we expect a cached result
    expect(axios.get).not.toBeCalled()

    // Validate the cached data is returned without modification
    expect(feeEstimation).toEqual(bitcoinCoreInstance.currentCypherResult)
  })

  test('Should throw an error for invalid API type', async () => {
    // No axios mocking needed here, as we are testing the error throw directly
    await expect(bitcoinCoreInstance.estimateFee('invalid_api'))
      .rejects
      .toThrow('Invalid API type specified')
  })
})
