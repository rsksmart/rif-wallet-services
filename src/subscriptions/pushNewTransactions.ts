import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { RSKExplorerAPI } from '../rskExplorerApi'

let lastReceivedTransactionBlockNumber = -1
const EXECUTION_INTERVAL = 60000

const pushNewTransactions = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string) => {
  const execute = executeFactory(socket, api, address)

  const timer = setInterval(execute, EXECUTION_INTERVAL)

  // store the last transaction block number when user subscribes
  api.getTransactionsByAddress(address.toLowerCase()).then(({ data }) => {
    if (data.length) {
      lastReceivedTransactionBlockNumber = data[0].blockNumber
    }
  })

  return () => {
    clearInterval(timer)
  }
}

const executeFactory = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: RSKExplorerAPI,
  address: string
) => async () => {
  const { data } = await api.getTransactionsByAddress(address.toLowerCase())
  // assuming descendent order, if the first transaction has smaller block number
  // than the last sent no transactions are pushed
  if (data.length && data[0].blockNumber > lastReceivedTransactionBlockNumber) {
    // push them in historical order
    data.reverse().forEach(transaction => {
      if (transaction.blockNumber > lastReceivedTransactionBlockNumber) {
        console.log('change', { type: 'newTransaction', payload: transaction })
        socket.emit('change', { type: 'newTransaction', payload: transaction })
      }
    })

    // once finished pushing, update to the last transaction sent
    lastReceivedTransactionBlockNumber = data[data.length - 1].blockNumber
  }
}

export default pushNewTransactions
