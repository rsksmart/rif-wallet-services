import { CoinMarketCapAPI } from '../src/coinmatketcap'

const rbtcLastUpdated = '2021-12-18T03:51:07.000Z'
const rbtcPrice = 46173.353546991406

const rifLastUpdated = '2021-12-18T03:50:08.000Z'
const rifPrice = 0.1966674666988437

export const coinmarketcapResponse = {
  status: {
    timestamp: '2021-12-18T03:52:09.880Z',
    error_code: 0,
    error_message: null,
    elapsed: 91,
    credit_count: 1,
    notice: null
  },
  data: {
    3626: {
      id: 3626,
      name: 'RSK Smart Bitcoin',
      symbol: 'RBTC',
      slug: 'rsk-smart-bitcoin',
      num_market_pairs: 7,
      date_added: '2018-12-05T00:00:00.000Z',
      tags: [
        'mineable'
      ],
      max_supply: null,
      circulating_supply: 2543.60681831,
      total_supply: 20999763.5577,
      is_active: 1,
      platform: null,
      cmc_rank: 397,
      is_fiat: 0,
      last_updated: rbtcLastUpdated,
      quote: {
        USD: {
          price: rbtcPrice,
          volume_24h: 36606.39111999,
          volume_change_24h: -18.1891,
          percent_change_1h: 1.07552435,
          percent_change_24h: -3.2071622,
          percent_change_7d: -4.15948796,
          percent_change_30d: -22.93603325,
          percent_change_60d: -25.86804715,
          percent_change_90d: -3.58131368,
          market_cap: 117493204.85283738,
          market_cap_dominance: 0.0054,
          fully_diluted_market_cap: 970012151164.67,
          last_updated: '2021-12-18T03:51:07.000Z'
        }
      }
    },
    3701: {
      id: 3701,
      name: 'RSK Infrastructure Framework',
      symbol: 'RIF',
      slug: 'rsk-infrastructure-framework',
      num_market_pairs: 17,
      date_added: '2019-01-16T00:00:00.000Z',
      tags: [
        'services',
        'filesharing',
        'payments'
      ],
      max_supply: null,
      circulating_supply: 807646673.6121615,
      total_supply: 1000000000,
      platform: {
        id: 3626,
        name: 'RSK RBTC',
        symbol: 'RBTC',
        slug: 'rsk-smart-bitcoin',
        token_address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5'
      },
      is_active: 1,
      cmc_rank: 340,
      is_fiat: 0,
      last_updated: rifLastUpdated,
      quote: {
        USD: {
          price: rifPrice,
          volume_24h: 2999843.49198644,
          volume_change_24h: -20.8066,
          percent_change_1h: 0.67443395,
          percent_change_24h: -5.66483526,
          percent_change_7d: -6.35310238,
          percent_change_30d: -22.75380092,
          percent_change_60d: -30.83218078,
          percent_change_90d: -20.18916468,
          market_cap: 158843452.50659508,
          market_cap_dominance: 0.0073,
          fully_diluted_market_cap: 196674434.13,
          last_updated: '2021-12-18T03:50:08.000Z'
        }
      }
    }
  }
}

export const pricesResponse = {
  '0x0000000000000000000000000000000000000000': {
    price: rbtcPrice,
    lastUpdated: rbtcLastUpdated
  },
  '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5': {
    price: rifPrice,
    lastUpdated: rifLastUpdated
  }
}

export const mockCoinMarketCap = () => {
  const getQuotesLatestMock = jest.fn(() => Promise.resolve({ data: coinmarketcapResponse }))

  const axiosMock = {
    get: getQuotesLatestMock
  }

  const coinMarketCapApi = new CoinMarketCapAPI('url', 'v1', 'api-key', axiosMock as any)

  return { axiosMock, coinMarketCapApi }
}
