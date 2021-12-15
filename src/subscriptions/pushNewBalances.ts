import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Api } from '../api'

interface ISendedBalances {
  [address: string]: {
    [tokenAddress: string]: string
  }
}

const EXECUTION_INTERVAL = 60000

const sendedBalances: ISendedBalances = {}

const pushNewBalances = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: Api,
  address: string
) => {
  const execute = executeFactory(socket, api, address)

  execute()

  const timer = setInterval(execute, EXECUTION_INTERVAL)

  return () => {
    clearInterval(timer)
    sendedBalances[address] = {}
  }
}

const executeFactory = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: Api,
  address: string
) => async () => {
  if (!sendedBalances[address]) {
    sendedBalances[address] = {}
  }

  const tokens = await api.getTokensByAddress(address.toLowerCase())

  for (const token of tokens) {
    if (sendedBalances[address][token.contractAddress] !== token.balance) {
      sendedBalances[address][token.contractAddress] = token.balance
      socket.emit('change', { type: 'newBalance', payload: token })
    }
  }
}

export default pushNewBalances
