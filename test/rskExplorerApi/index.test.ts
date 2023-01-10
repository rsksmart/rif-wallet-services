import axios from 'axios'
import { RSKExplorerAPI } from '../../src/rskExplorerApi'

jest.mock('axios')

const rskExplorerApiMock = new RSKExplorerAPI('url', 31, axios, '31')

describe('balances', () => {
  test('should not return rbtc balance a new wallet', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: []
      }
    })
    const address = '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1'
    const balance = await rskExplorerApiMock.getRbtcBalanceByAddress(address)
    expect(axios.get).toHaveBeenCalledWith('url', {
      params: {
        action: 'getBalances',
        address,
        module: 'balances'
      }
    })
    expect(balance).toEqual([])
  })

  test('should return rbtc balance', async () => {
    const address = '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1';
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: '639c8fd8a902c050150f56f8',
            address,
            balance: '0x98a156b222f262',
            blockHash: '0xdead155bb70fbfb570b4e9c492e53c4ef997e4aaf2543d476126d4ddcf3c08e3',
            blockNumber: 3423958,
            timestamp: 1671198250,
            _created: 1671204824776
          },
          {
            _id: '633c5b16a524513e51b6db75',
            address,
            balance: '0xa6dcee135638e2',
            blockHash: '0x62baaceb4be7f5427760f6227e4996b4e0b4573253d1ffe81754b51ee41fd456',
            blockNumber: 3226579,
            timestamp: 1664893105,
            _created: 1664899862631
          },
          {
            _id: '633c5b16a524513e51b6db69',
            address,
            balance: '0x9c33273967d642',
            blockHash: '0xdbd007d6f142b70fcd1e99832bcb961c6e87af1616a1d1fd7e1cf667742f4488',
            blockNumber: 3226581,
            timestamp: 1664893202,
            _created: 1664899862598
          }
        ]
      }
    })
    const balance = await rskExplorerApiMock.getRbtcBalanceByAddress(address)
    expect(axios.get).toHaveBeenCalledWith('url', {
      params: {
        action: 'getBalances',
        address,
        module: 'balances'
      }
    })
    expect(balance).toEqual([{
      name: 'RBTC',
      symbol: 'RBTC',
      contractAddress: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      balance: '0x98a156b222f262'
    }])
  })
})
