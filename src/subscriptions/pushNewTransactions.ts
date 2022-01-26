import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RSKExplorerAPI } from '../rskExplorerApi'

interface ISentBalances {
  [address: string]: {
      [transactionHash: string]: string
  }
}

const sentTransactions: ISentBalances = {}
const EXECUTION_INTERVAL = 60000

const pushNewTransactions = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string) => {
  const execute = executeFactory(socket, api, address)

  const timer = setInterval(execute, EXECUTION_INTERVAL)

  return () => {
    clearInterval(timer)
    sentTransactions[address] = {}
  }
}

const executeFactory = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string
) => async () => {
  if (!sentTransactions[address]) {
    sentTransactions[address] = {}
  }

  const { data } = await api.getTransactionsByAddress(address.toLowerCase())
  data.forEach(transaction => {
    if (!sentTransactions[address][transaction.hash]) {
      sentTransactions[address][transaction.hash] = transaction.hash
      socket.emit('change', { type: 'newTransaction', payload: transaction })
    }
  })
}

export default pushNewTransactions
