import { IEvent } from '../../rskExplorerApi/types'

export function isMyTransaction (event: IEvent, address: string) {
  return event.args.some((arg) => arg.toLowerCase() === address.toLowerCase())
}
