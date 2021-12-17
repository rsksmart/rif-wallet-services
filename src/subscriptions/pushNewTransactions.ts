import { Socket } from 'socket.io'
import io from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

interface ISentBalances {
  [address: string]: {
      [transactionHash: string]: string
  }
}

const sentTransactions: ISentBalances = {}

const pushNewTransactions = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  address: string) => {
  const transactionChannel = 'transactions'
  const transactionAction = 'newTransactions'
  const WS_URL = process.env.WS_EXPLORER_URL as string || 'wss://backend.explorer.testnet.rsk.co'
  const client = io(WS_URL, { reconnect: true })

  client.on('connect', () => {
    console.log('connected!')
    sentTransactions[address] = {}
    client.emit('subscribe', { to: transactionChannel })
  })

  client.on('subscription', res => {
    console.log(`Subscription to ${res.channel} was successfully`)
  })

  client.on('data', res => {
    const { channel, action, data } = res
    if (channel === transactionChannel && action === transactionAction) {
      if (!data || !data.data) return
      const transactions = data.data
      transactions
        .filter(transaction => transaction.from === address.toLowerCase() ||
          transaction.to === address.toLowerCase())
        .forEach(transaction => {
          if (!sentTransactions[address][transaction.hash]) {
            sentTransactions[address][transaction.hash] = transaction.hash
            socket.emit('change', { type: 'newTransaction', payload: transaction })
          }
        })
    }
  })
  return () => {
    client.close()
  }
}

export default pushNewTransactions
