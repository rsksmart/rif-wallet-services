import type { IApiTransactions } from './transactions'
import { ITokenWithBalance, IEvent } from '../rskExplorerApi/types'

export type Event = {
  type: string
  payload: ITokenWithBalance | IApiTransactions | IEvent
}
