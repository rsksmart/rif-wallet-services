import axios from 'axios'

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
