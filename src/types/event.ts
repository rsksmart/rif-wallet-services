import { IApiTransactions, ITokenWithBalance, IEvent } from '../rskExplorerApi/types'

export type Event = {
  type: string
  payload: ITokenWithBalance | IApiTransactions | IEvent
}
