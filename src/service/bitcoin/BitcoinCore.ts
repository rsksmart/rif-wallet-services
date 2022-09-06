import axios from 'axios'

export default class BitcoinCore {
  BLOCKBOOK_URL: string
  BLOCKBOOK_APIS

  constructor (BLOCKBOOK_URL) {
    this.BLOCKBOOK_URL = BLOCKBOOK_URL
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
    const { data }: any = await axios.get(this.BLOCKBOOK_APIS.getXpubInfo + xpub + queryParsed)
    data.btc = this.convertSatoshiToBtc(data.balance)
    return data
  }

  async getXpubBalance (xpub: string) {
    const { data }: any = await axios.get(this.BLOCKBOOK_APIS.getXpubBalance(xpub))
    data.btc = this.convertSatoshiToBtc(data.balance)
    return data
  }
}
