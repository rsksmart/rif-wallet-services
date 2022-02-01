import { RSKExplorerAPI } from "../../rskExplorerApi";

export class EventProvider {
  private rskExplorerApi: RSKExplorerAPI

  constructor() {
    this.rskExplorerApi = RSKExplorerAPI.getInstance()
  }


  async getEventsByAddress(address: string) {
    return this.rskExplorerApi.getEventsByAddress(address)
  }

}