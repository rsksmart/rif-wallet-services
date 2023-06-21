import { IEvent, IInternalTransaction } from '../../rskExplorerApi/types'

export function isMyTransaction (event: IEvent | IInternalTransaction, address: string) {
  if("args" in event) {
    return event.args.some((arg) => arg.toLowerCase() === address.toLowerCase())
  }
  if("action" in event) {
    return event.action.from.toLowerCase() === address.toLowerCase() 
      || event.action.to.toLowerCase() === address.toLowerCase()
  }
}
