import { IEvent } from '../../rskExplorerApi/types'

export function isIncomingTransaction (event: IEvent, address: string) {
  return event.args[1].toLowerCase() === address.toLowerCase()
}
