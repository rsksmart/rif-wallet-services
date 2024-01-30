import { BalanceProvider } from '../../../src/service/balance/balanceProvider'
import { mockAddress, tokenResponse } from '../../mockAddressResponses'

describe('Circuit Breaker', () => {
  test('Circuit Breaker is open', (done) => {
    let i = 0
    const getTokensByAddressMock = jest.fn(() => {
      if (i <= 2) {
        i++
        Promise.resolve(tokenResponse)
      } else {
        Promise.reject(new Error('custom error'))
      }
    })
    const rskExplorerApiMock = {
      getTokensByAddress: getTokensByAddressMock
    }
    const balanceProvider = new BalanceProvider(mockAddress, rskExplorerApiMock as any)
    balanceProvider.interval = 1000
    balanceProvider.subscribe(mockAddress).then(() => {
      setTimeout(() => {
        expect(balanceProvider.breaker.stats.failures).toEqual(1)
        balanceProvider.unsubscribe()
        done()
      }, 2000)
    })
  })
})
