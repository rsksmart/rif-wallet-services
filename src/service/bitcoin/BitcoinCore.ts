import axios from 'axios'

type BIPTYPES = 'BIP44' | 'BIP84'

type TokensType = {
  path: string
  name: string
}
export default class BitcoinCore {
  BLOCKBOOK_URL: string
  BLOCKBOOK_APIS
  axiosInstance: typeof axios

  constructor (BLOCKBOOK_URL, axiosInstance = axios) {
    this.BLOCKBOOK_URL = BLOCKBOOK_URL
    this.axiosInstance = axiosInstance
    this.setBlockbookAPIS()
  }

  setBlockbookAPIS () {
    this.BLOCKBOOK_APIS = {
      getXpubInfo: `${this.BLOCKBOOK_URL}/api/v2/xpub/`,
      getXpubBalance: (xpub: string) => `${this.BLOCKBOOK_URL}/api/v2/xpub/${xpub}?details=basic`
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
    bip: BIPTYPES = 'BIP84',
    accountIndex: string = '0',
    knownLastUsedIndex: string = '0') {
    let outputDescriptor: string

    switch (bip) {
      case 'BIP44':
        outputDescriptor = `pkh(${xpub}/<${accountIndex}>/*)`
        break
      case 'BIP84':
      default:
        outputDescriptor = `wpkh(${xpub}/<${accountIndex}>/*)`
        break
    }

    const { data: { tokens } }: { data: { tokens: Array<TokensType>} } = await this.axiosInstance.get(
      `${this.BLOCKBOOK_APIS.getXpubInfo}${outputDescriptor}?tokens=used`
    )
    let lastUsedIndex = Number(knownLastUsedIndex)
    const usedTokensMap = tokens?.reduce((prev, { path }) => {
      const index = Number(path.substr(path.lastIndexOf('/') + 1))
      prev[index] = true
      return prev
    }, {}) || {}

    if (lastUsedIndex < 0) lastUsedIndex = 0 // To make sure we don't search from -XXXX... [security]
    while (true) {
      if (!usedTokensMap[lastUsedIndex]) {
        break
      }
      lastUsedIndex++
      if (lastUsedIndex > 2000) { // Loop breaker - security
        break
      }
    }
    return { index: lastUsedIndex }
  }
}
