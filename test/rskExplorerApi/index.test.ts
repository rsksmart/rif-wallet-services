import axios from 'axios'
import { RSKExplorerAPI } from '../../src/rskExplorerApi'

jest.mock('axios')

const rskExplorerApiMock = new RSKExplorerAPI('url', 31, axios, '31')

const listedTokenRow = (address: string, name: string, symbol: string) => ({
  address,
  name,
  symbol,
  balance: '0',
  blockNumber: 1,
  decimals: 18,
  contract_interface: ['ERC20']
})

const heldTokenRow = (holder: string, contract: string, name: string, symbol: string) => ({
  address: holder,
  contract,
  blockNumber: 2,
  blockHash: '0xbb',
  balance: '1',
  name,
  symbol,
  decimals: 6,
  contract_interface: ['ERC20']
})

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

describe('getTokens pagination', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset()
  })

  test('follows nextCursor until hasMoreData is false', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    ;(axios.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          paginationData: {
            nextCursor: 'c1',
            prevCursor: null,
            take: 50,
            hasMoreData: true
          },
          data: [listedTokenRow('0x0000000000000000000000000000000000000001', 'A', 'A')]
        }
      })
      .mockResolvedValueOnce({
        data: {
          paginationData: {
            nextCursor: null,
            prevCursor: null,
            take: 50,
            hasMoreData: false
          },
          data: [listedTokenRow('0x0000000000000000000000000000000000000002', 'B', 'B')]
        }
      })

    const tokens = await api.getTokens()
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenNthCalledWith(1, 'url/tokens', { params: { take: 50 } })
    expect(axios.get).toHaveBeenNthCalledWith(2, 'url/tokens', { params: { take: 50, cursor: 'c1' } })
    expect(tokens.map(t => t.symbol).sort()).toEqual(['A', 'B'])
  })

  test('dedupes the same token address on consecutive pages', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    const dupAddr = '0x00000000000000000000000000000000000000aa'
    ;(axios.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          paginationData: {
            nextCursor: 'c2',
            prevCursor: null,
            take: 50,
            hasMoreData: true
          },
          data: [listedTokenRow(dupAddr, 'One', 'ONE')]
        }
      })
      .mockResolvedValueOnce({
        data: {
          paginationData: { nextCursor: null, prevCursor: null, take: 50, hasMoreData: false },
          data: [listedTokenRow(dupAddr, 'OneDup', 'ONE')]
        }
      })

    const tokens = await api.getTokens()
    expect(tokens).toHaveLength(1)
    expect(tokens[0].symbol).toBe('ONE')
  })
})

describe('getTokensByAddress pagination', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset()
  })

  test('merges pages and passes cursor', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    const holder = '0x1111111111111111111111111111111111111111'
    ;(axios.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          paginationData: {
            nextCursor: 99,
            prevCursor: null,
            take: 50,
            hasMoreData: true
          },
          data: [heldTokenRow(holder, '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'T1', 'T1')]
        }
      })
      .mockResolvedValueOnce({
        data: {
          paginationData: { nextCursor: null, prevCursor: null, take: 50, hasMoreData: false },
          data: [heldTokenRow(holder, '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'T2', 'T2')]
        }
      })

    const tokens = await api.getTokensByAddress(holder)
    const path = `url/tokens/address/${holder}`
    expect(axios.get).toHaveBeenNthCalledWith(1, path, { params: { take: 50 } })
    expect(axios.get).toHaveBeenNthCalledWith(2, path, { params: { take: 50, cursor: '99' } })
    expect(tokens).toHaveLength(2)
    expect(tokens.map(t => t.symbol).sort()).toEqual(['T1', 'T2'])
  })
})

describe('getTransactionsByAddress', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset()
  })

  test('maps pagination and uses next as cursor when provided', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    const addr = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    ;(axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        paginationData: {
          nextCursor: 'n1',
          prevCursor: 'p0',
          take: 50,
          hasMoreData: true
        },
        data: [{
          txId: 'tid1',
          hash: '0xabc',
          blockNumber: 100,
          from: addr,
          to: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          gasUsed: 21000,
          gasPrice: '1',
          value: '0',
          input: '0x',
          timestamp: '1700000000',
          transactionIndex: 0,
          txType: 'normal'
        }]
      }
    })

    const out = await api.getTransactionsByAddress(addr, '50', undefined, 'cursorFromClient', '0')
    expect(axios.get).toHaveBeenCalledWith(`url/txs/address/${addr}`, {
      params: { take: 50, cursor: 'cursorFromClient' }
    })
    expect(out.prev).toBe('p0')
    expect(out.next).toBe('n1')
    expect(out.data).toHaveLength(1)
    expect(out.data[0].hash).toBe('0xabc')
    expect(out.data[0].blockNumber).toBe(100)
  })

  test('uses prev as cursor when next is absent', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    const addr = '0xcccccccccccccccccccccccccccccccccccccccc'
    ;(axios.get as jest.Mock).mockResolvedValueOnce({
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

    await api.getTransactionsByAddress(addr, '50', 'onlyPrev', undefined, '0')
    expect(axios.get).toHaveBeenCalledWith(`url/txs/address/${addr}`, {
      params: { take: 50, cursor: 'onlyPrev' }
    })
  })
})

describe('getTransaction', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset()
  })

  test('returns null when data is null', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    ;(axios.get as jest.Mock).mockResolvedValueOnce({ data: { data: null } })
    await expect(api.getTransaction('0xdead')).resolves.toBeNull()
  })

  test('returns null on request failure', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    ;(axios.get as jest.Mock).mockRejectedValueOnce(new Error('boom'))
    await expect(api.getTransaction('0xbeef')).resolves.toBeNull()
  })

  test('maps successful response', async () => {
    const api = new RSKExplorerAPI('url', 31, axios, '31')
    ;(axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: {
          txId: 'x1',
          hash: '0xhash1',
          blockNumber: 7,
          blockHash: '0xbh',
          from: '0xfrom',
          to: '0xto',
          gas: 21000,
          gasPrice: '99',
          value: '1',
          input: '0x',
          timestamp: '1700000001',
          transactionIndex: 2,
          txType: 'normal',
          nonce: 5
        }
      }
    })

    const tx = await api.getTransaction('0xhash1')
    expect(tx).not.toBeNull()
    expect(tx).toMatchObject({
      hash: '0xhash1',
      nonce: 5,
      blockNumber: 7,
      from: '0xfrom',
      to: '0xto',
      txId: 'x1'
    })
  })
})
