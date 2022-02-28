import { IApiTransactions, ITokenWithBalance } from '../rskExplorerApi/types'

export class Event {
  type: string
  payload: ITokenWithBalance | IApiTransactions

  constructor (type, payload) {
    this.type = type
    this.payload = payload
  }
}
