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
      getXpubBalance: (xpub: string) => `${this.BLOCKBOOK_URL}/api/v2/xpub/${xpub}?details=basic`,
      getXpubUtxos: `${this.BLOCKBOOK_URL}/api/v2/utxo/`,
      sendTransaction: `${this.BLOCKBOOK_URL}/api/v2/sendtx/`
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
    changeIndex: string = '0',
    knownLastUsedIndex: string = '0') {
    let outputDescriptor: string

    switch (bip) {
      case 'BIP44':
        outputDescriptor = `pkh(${xpub}/<${changeIndex}>/*)`
        break
      case 'BIP84':
      default:
        outputDescriptor = `wpkh(${xpub}/<${changeIndex}>/*)`
        break
    }

    const { data: { tokens } }: { data: { tokens: Array<TokensType> } } = await this.axiosInstance.get(
        `${this.BLOCKBOOK_APIS.getXpubInfo}${outputDescriptor}?tokens=used`
    )
    let lastUsedIndex = Number(knownLastUsedIndex)
    let max = -1
    const usedTokensMap = tokens?.reduce((prev, { path }) => {
      const index = Number(path.substr(path.lastIndexOf('/') + 1))
      prev[index] = true
      max = index
      return prev
    }, {}) || {}
    if (max === -1) return { index: 0 } // No addresses found - the first one can be created
    if (lastUsedIndex >= max) return { index: max + 1 }
    if (lastUsedIndex < 0) lastUsedIndex = 0 // To make sure we don't search from -XXXX... [security]
    while (lastUsedIndex <= max) {
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
}
