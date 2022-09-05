import axios from 'axios'

const BLOCKBOOK_URL = process.env.BLOCKBOOK_URL || 'https://tbtc1.blockbook.bitaccess.net'
const BLOCKBOOK_APIS = {
  getXpubInfo: `${BLOCKBOOK_URL}/api/v2/xpub/`
}

export default class BitcoinCore {
  static async getXpubInfo (xpub: string) {
    const { data }: any = await axios.get(BLOCKBOOK_APIS.getXpubInfo + xpub)
    data.btc = data.balance / Math.pow(10, 8)
    return data
  }
}
