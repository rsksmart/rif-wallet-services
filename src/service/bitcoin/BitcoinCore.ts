import axios from 'axios'
import { CypherFeeEstimationResult } from './types'

type BIPTYPES = 'BIP44' | 'BIP84'

type TokensType = {
  path: string
  name: string
}

const LOOP_MAX_ITERATIONS = 2000
const DEFAULT_ADDRESS_INDEXES_TO_RETURN = 10
const DEFAULT_BIP = 'BIP84'

// BlockCypher Limit: 600 request per hour - which equals to aprox 10 requests per minute
// This is being limited to 3 request per minute
const CYPHER_CACHE_EXPIRATION_TIME = 20 * 1000 // 20 seconds in milliseconds

export default class BitcoinCore {
  BLOCKBOOK_URL: string
  CYPHER_ESTIMATE_URL: string
  BLOCKBOOK_APIS
  axiosInstance: typeof axios
  currentCypherResult: CypherFeeEstimationResult & { timeCached: number } | null = null

  constructor ({
    BLOCKBOOK_URL,
    axiosInstance = axios,
    CYPHER_ESTIMATE_FEE_URL
  }) {
    this.BLOCKBOOK_URL = BLOCKBOOK_URL
    this.axiosInstance = axiosInstance
    this.setBlockbookAPIS()
    this.CYPHER_ESTIMATE_URL = CYPHER_ESTIMATE_FEE_URL
  }

  setBlockbookAPIS () {
    this.BLOCKBOOK_APIS = {
      getXpubInfo: `${this.BLOCKBOOK_URL}/api/v2/xpub/`,
      getXpubBalance: (xpub: string) => `${this.BLOCKBOOK_URL}/api/v2/xpub/${xpub}?details=basic`,
      getXpubUtxos: `${this.BLOCKBOOK_URL}/api/v2/utxo/`,
      sendTransaction: `${this.BLOCKBOOK_URL}/api/v2/sendtx/`,
      getXpubTransactions: (xpub: string) => `${this.BLOCKBOOK_URL}/api/v2/xpub/${xpub}?details=txs&`,
      estimateFee: `${this.BLOCKBOOK_URL}/api/v1/estimatefee/`
    }
  }

  convertSatoshiToBtc (satoshis) {
    return Number(satoshis) / Math.pow(10, 8)
  }

  async getXpubInfo (xpub: string, queryParsed: string | undefined = '') {
    const { data }: any = await this.axiosInstance.get(this.BLOCKBOOK_APIS.getXpubInfo + xpub + queryParsed)
    data.btc = this.convertSatoshiToBtc(data.balance)
    return data
  }

  async getXpubBalance (xpub: string) {
    const { data }: any = await this.axiosInstance.get(this.BLOCKBOOK_APIS.getXpubBalance(xpub))
    data.btc = this.convertSatoshiToBtc(data.balance)
    return data
  }

  async getNextUnusedIndex (
    xpub: string,
    bip: BIPTYPES = DEFAULT_BIP,
    changeIndex: string = '0',
    knownLastUsedIndex: string = '0',
    maxIndexesToFetch: string = '5'
  ) {
    const outputDescriptor = bip === 'BIP44' ? `pkh(${xpub}/<${changeIndex}>/*)` : `wpkh(${xpub}/<${changeIndex}>/*)`

    const { data: { tokens } } = await this
      .axiosInstance
      .get<{ tokens: TokensType[] }>(`${this.BLOCKBOOK_APIS.getXpubInfo}${outputDescriptor}?tokens=used`)

    let lastUsedIndex = Number(knownLastUsedIndex)

    let max = -1
    const usedTokensSet = new Set<number>()

    for (const { path } of tokens) {
      const index = Number(path.substr(path.lastIndexOf('/') + 1))
      usedTokensSet.add(index)
      max = Math.max(max, index)
    }

    if (lastUsedIndex > max || lastUsedIndex < 0) {
      lastUsedIndex = Math.max(0, max + 1)
    }

    const availableIndexes: number[] = []
    const maxToFetch = Math.min(Number(maxIndexesToFetch), DEFAULT_ADDRESS_INDEXES_TO_RETURN)

    while (availableIndexes.length < maxToFetch && lastUsedIndex <= LOOP_MAX_ITERATIONS) {
      if (!usedTokensSet.has(lastUsedIndex)) {
        availableIndexes.push(lastUsedIndex)
      }
      lastUsedIndex++
    }

    return { index: availableIndexes[0], availableIndexes }
  }

  async getXpubUtxos (xpub: string) {
    const { data }: any = await this.axiosInstance.get(this.BLOCKBOOK_APIS.getXpubUtxos + xpub)
    return data
  }

  async sendTransaction (hextxdata: string) {
    const data: any = await this.axiosInstance.get(this.BLOCKBOOK_APIS.sendTransaction + hextxdata)
      .then(({ data }) => data)
      .catch((error) => {
        return { error: error.response.data.error || 'Unknown error' }
      })
    return data
  }

  async getXpubTransactions (xpub: string, queryParsed: string | undefined = '') {
    const passedQueryParams = queryParsed !== '' ? queryParsed?.substring(1) : ''
    const { data }: any = await this.axiosInstance.get(
      this.BLOCKBOOK_APIS.getXpubTransactions(xpub) + passedQueryParams
    )
    return data
  }

  async estimateFee (apiSource = 'blockbook', numberOfBlocks = 6) {
    let data

    if (apiSource === 'blockbook') {
      const response = await this
        .axiosInstance
        .get<{ result: string }>(`${this.BLOCKBOOK_APIS.estimateFee}${numberOfBlocks}`)
      data = response.data
    } else if (apiSource === 'cypher') {
      const currentTime = Date.now()
      if (
        this.currentCypherResult &&
        this.currentCypherResult.timeCached &&
        currentTime - this.currentCypherResult.timeCached < CYPHER_CACHE_EXPIRATION_TIME) {
        data = this.currentCypherResult
      } else {
        const response = await this
          .axiosInstance
          .get<CypherFeeEstimationResult>(this.CYPHER_ESTIMATE_URL)
        data = {
          ...response.data,
          timeCached: currentTime
        }
        this.currentCypherResult = data
      }
    } else {
      throw new Error('Invalid API type specified')
    }

    return data
  }
}
