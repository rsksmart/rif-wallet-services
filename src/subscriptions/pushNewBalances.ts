import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Api } from '../api'

const pushNewBalances = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  api: Api, address: string
) => {
  const balances = await api.getBalances(address.toLowerCase())

  for (const balance of balances.data) {
    socket.emit('something', { type: 'newBalance', payload: balance })
  }
}

export default pushNewBalances
