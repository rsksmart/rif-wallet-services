import { IApiTransactions, ITokenWithBalance } from '../rskExplorerApi/types'

export type Event = {
  type: string
  payload: ITokenWithBalance | IApiTransactions
}
