import { RSKExplorerAPI } from '../../rskExplorerApi'

export class TokenProvider {
  private rskExplorerApi : RSKExplorerAPI

  constructor () {
    this.rskExplorerApi = RSKExplorerAPI.getInstance()
  }

  async getTokens () {
    return this.rskExplorerApi.getTokens()
  }

  async getTokensByAddress (address: string) {
    return this.rskExplorerApi.getTokensByAddress(address)
  }
}
