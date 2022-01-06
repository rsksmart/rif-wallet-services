import { mockCoinMarketCap, pricesResponse } from './mockResponses'

describe('coin market cap', () => {
  test('valid query', async () => {
    const { coinMarketCapApi } = mockCoinMarketCap()

    const response = await coinMarketCapApi.getQuotesLatest({
      addresses: ['0x0000000000000000000000000000000000000000', '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'],
      convert: 'USD'
    })

    expect(response).toEqual(pricesResponse)
  })
})
