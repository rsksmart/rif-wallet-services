import axios from 'axios'
import { RSKExplorerAPI } from '../../src/rskExplorerApi'

jest.mock('axios')

const rskExplorerApiMock = new RSKExplorerAPI('url', 31, axios, '31')

describe('balances', () => {
  test('should not return rbtc balance a new wallet', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        paginationData: {
          nextCursor: null,
          prevCursor: null,
          take: 50,
          hasMoreData: false
        },
        data: []
      }
    })
    const address = '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1'
    const balance = await rskExplorerApiMock.getRbtcBalanceByAddress(address)
    expect(axios.get).toHaveBeenCalledWith(`url/balances/address/${address}`, {
      params: {
        take: 50
      }
    })
    expect(balance).toEqual([])
  })

  test('should return rbtc balance', async () => {
    const address = '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1';
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        paginationData: {
          nextCursor: null,
          prevCursor: null,
          take: 50,
          hasMoreData: false
        },
        data: [
          {
            id: '101724447',
            blockNumber: 3423958,
            timestamp: '1671198250',
            balance: '0x98a156b222f262'
          },
          {
            id: '101724442',
            blockNumber: 3226579,
            timestamp: '1664893105',
            balance: '0xa6dcee135638e2'
          },
          {
            id: '101724435',
            blockNumber: 3226581,
            timestamp: '1664893202',
            balance: '0x9c33273967d642'
          }
        ]
      }
    })
    const balance = await rskExplorerApiMock.getRbtcBalanceByAddress(address)
    expect(axios.get).toHaveBeenCalledWith(`url/balances/address/${address}`, {
      params: {
        take: 50
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
