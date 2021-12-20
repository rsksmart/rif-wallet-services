import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RSKExplorerAPI } from '../rskExplorerApi'

interface ISentBalances {
  [address: string]: {
    [tokenAddress: string]: string
  }
}

const EXECUTION_INTERVAL = 60000

const sentBalances: ISentBalances = {}

const pushNewBalances = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string
) => {
  const execute = executeFactory(socket, api, address)

  execute()

  const timer = setInterval(execute, EXECUTION_INTERVAL)

  return () => {
    clearInterval(timer)
    sentBalances[address] = {}
  }
}

const executeFactory = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string
) => async () => {
  if (!sentBalances[address]) {
    sentBalances[address] = {}
  }

  const tokens = await api.getTokensByAddress(address.toLowerCase())

  for (const token of tokens) {
    if (sentBalances[address][token.contractAddress] !== token.balance) {
      sentBalances[address][token.contractAddress] = token.balance
      socket.emit('change', { type: 'newBalance', payload: token })
    }
  }
}

export default pushNewBalances
