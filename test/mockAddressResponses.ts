export const mockAddress = '0xdf3F858032E370ae039417b278403ba90aB8Bb64'

export const tokenResponse = [
  {
    name: 'tRIF Token',
    symbol: 'tRIF',
    contractAddress: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
    decimals: 18,
    balance: '0x56bc75e2d63100000'
  }
]

export const tokenSecondResponse = [
  {
    name: 'tRIF Token',
    symbol: 'tRIF',
    contractAddress: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
    decimals: 18,
    balance: '0x56900d33ca7fc0000'
  }
]

export const transactionSecondResponse = {
  prev: null,
  next: null,
  data: [
    {
      _id: '61ef70bae13e1554d70cd2f6',
      hash: '0xb8371e6f9bd64d9d6d59e129043798525d2100e41ca842795c20486de3d536f7',
      nonce: 31,
      blockHash: '0x9d4818adc27942c43f16c3a1bf535baac5b2b03f25be79c784684447757fd8de',
      blockNumber: 2526433,
      transactionIndex: 0,
      from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
      to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
      gas: 50948,
      gasPrice: '0x3ec4458',
      value: '0x11c37937e08000',
      input: '0x244f53b5000000000000000000000000',
      v: '0x62',
      r: '0xf7a0afcdc43acc4f0ed168eda0c36d52099474dcc038ad6b583a034ac35d18f3',
      s: '0x35a63e4d5b9b7f5fe6a8272f87fd9bfabb4ac0984a913e854dbc75ac811e3957',
      timestamp: 1643081859,
      receipt: {
        transactionHash: '0xb8371e6f9bd64d9d6d59e129043798525d2100e41ca842795c20486de3d536f7',
        transactionIndex: 0,
        blockHash: '0x9d4818adc27942c43f16c3a1bf535baac5b2b03f25be79c784684447757fd8de',
        blockNumber: 2526433,
        cumulativeGasUsed: 35149,
        gasUsed: 35149,
        contractAddress: null,
        logs: [],
        from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
        to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
        status: '0x1',
        logsBloom: '0x000000000000000000000000000000000000000000000'
      },
      txType: 'contract call',
      txId: '0268ce10009c784684447757fd8de'
    },
    {
      _id: '61ef707ae13e1554d70cd1b8',
      hash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
      nonce: 30,
      blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
      blockNumber: 2526431,
      transactionIndex: 0,
      from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
      to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
      gas: 35948,
      gasPrice: '0x3ec4458',
      value: '0x11c37937e08000',
      input: '0x244f53b5000000000000000000000000',
      v: '0x61',
      r: '0x765df5df534909d41cd4fef4b783c653b9d5c3bf92a8227408c970ad19af9c31',
      s: '0x462f9b61cbc808fb490c8353e8e93c23c764417ff66ff794694d8ee14dadb03a',
      timestamp: 1643081782,
      receipt: {
        transactionHash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
        transactionIndex: 0,
        blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
        blockNumber: 2526431,
        cumulativeGasUsed: 35948,
        gasUsed: 35948,
        contractAddress: null,
        logs: [],
        from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
        to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
        status: '0x0',
        logsBloom: '0x000000000000000000000000000000000000000000000'
      },
      txType: 'contract call',
      txId: '0268cdf000ae1a107721eb830b92a'
    }
  ]
}

export const transactionFromEventResponse = {
  _id: '61eef1b5e13e1554d70c0c3a',
  hash: '0xcb08a5c3417c4d25956f7fa70d1da0f558568ad91979580664176281cfa037e9',
  nonce: 10,
  blockHash: '0xc2965eaf240f1870c17083e685239c0368acd72c2524e8bf67108400de040cc1',
  blockNumber: 2525443,
  transactionIndex: 1,
  from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
  to: '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
  gas: 111261,
  gasPrice: '0x3e252e1',
  value: '0x0',
  input: '0x5f746233000000000000000000000000df3f858032e370ae039417b278403ba90ab8bb64',
  v: '0x61',
  r: '0xfe654fc91996a3ca0b032030397caf1e041c33660054359938c1ea602e0087fa',
  s: '0x2fc43289ebdd0727ac4657d4f288883b0154ebda2b8f90c296b8ef5b08380022',
  timestamp: 1643049374,
  receipt: {
    transactionHash: '0xcb08a5c3417c4d25956f7fa70d1da0f558568ad91979580664176281cfa037e9',
    transactionIndex: 1,
    blockHash: '0xc2965eaf240f1870c17083e685239c0368acd72c2524e8bf67108400de040cc1',
    blockNumber: 2525443,
    cumulativeGasUsed: 116163,
    gasUsed: 74174,
    contractAddress: null,
    logs: [
      {
        logIndex: 0,
        blockNumber: 2525443,
        blockHash: '0xc2965eaf240f1870c17083e685239c0368acd72c2524e8bf67108400de040cc1',
        transactionHash: '0xcb08a5c3417c4d25956f7fa70d1da0f558568ad91979580664176281cfa037e9',
        transactionIndex: 1,
        address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        data: '0x0000000000000000000000000000000000000000000000056bc75e2d63100000',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
          '0x000000000000000000000000df3f858032e370ae039417b278403ba90ab8bb64'
        ],
        event: 'Transfer',
        args: [
          '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
          '0xdf3f858032e370ae039417b278403ba90ab8bb64',
          '0x56bc75e2d63100000'
        ],
        abi: {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              name: 'to',
              type: 'address'
            },
            {
              indexed: false,
              name: 'value',
              type: 'uint256'
            }
          ],
          name: 'Transfer',
          type: 'event'
        },
        signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        _addresses: [
          '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
          '0xdf3f858032e370ae039417b278403ba90ab8bb64'
        ],
        eventId: '02689030010008bf67108400de040cc1',
        timestamp: 1643049374,
        txStatus: '0x1'
      }
    ],
    from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
    to: '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
    status: '0x1',
    logsBloom: '0x00000000000000000000000000000000000000000000000000000' +
    '1000000000000000000000000000000000000000100000000000000000000000000' +
    '00000000000000000000000000000008000000000000000000000000000000000000' +
    '0000000002000000000000000000000000000000000000000800000000100000000' +
    '0000000000000000000000000000000000000000100000000000000000000400000' +
    '0000000000000008000000000000000000000400000000000000000000000000000' +
    '0020000000000000000000000000000000000000000000000000000000000000000' +
    '04000000000000000000000000000000000000000000000000000000'
  },
  txType: 'contract call',
  txId: '02689030018bf67108400de040cc1'
}

export const transactionResponse = {
  prev: null,
  next: null,
  data: [
    {
      _id: '61ef707ae13e1554d70cd1b8',
      hash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
      nonce: 30,
      blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
      blockNumber: 2526431,
      transactionIndex: 0,
      from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
      to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
      gas: 35948,
      gasPrice: '0x3ec4458',
      value: '0x11c37937e08000',
      input: '0x244f53b5000000000000000000000000',
      v: '0x61',
      r: '0x765df5df534909d41cd4fef4b783c653b9d5c3bf92a8227408c970ad19af9c31',
      s: '0x462f9b61cbc808fb490c8353e8e93c23c764417ff66ff794694d8ee14dadb03a',
      timestamp: 1643081782,
      receipt: {
        transactionHash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
        transactionIndex: 0,
        blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
        blockNumber: 2526431,
        cumulativeGasUsed: 35948,
        gasUsed: 35948,
        contractAddress: null,
        logs: [],
        from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
        to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
        status: '0x0',
        logsBloom: '0x000000000000000000000000000000000000000000000'
      },
      txType: 'contract call',
      txId: '0268cdf000ae1a107721eb830b92a'
    }
  ]
}

export const transactionWithEventResponse = {
  prev: null,
  next: null,
  data: [
    ...transactionResponse.data,
    transactionFromEventResponse
  ]
}

export const txResponse = {
  data:
  {
    _id: '61ef707ae13e1554d70cd1b8',
    hash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
    nonce: 30,
    blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
    blockNumber: 2526431,
    transactionIndex: 0,
    from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
    to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
    gas: 35948,
    gasPrice: '0x3ec4458',
    value: '0x11c37937e08000',
    input: '0x244f53b5000000000000000000000000',
    v: '0x61',
    r: '0x765df5df534909d41cd4fef4b783c653b9d5c3bf92a8227408c970ad19af9c31',
    s: '0x462f9b61cbc808fb490c8353e8e93c23c764417ff66ff794694d8ee14dadb03a',
    timestamp: 1643081782,
    receipt: {
      transactionHash: '0x82dbb412363693d7334d1e3fc15b7a6453861ffa16d511966565443ff73699dd',
      transactionIndex: 0,
      blockHash: '0x5ddd52bde4249f382b3c95da3443425e5671c8ae86416ae1a107721eb830b92a',
      blockNumber: 2526431,
      cumulativeGasUsed: 35948,
      gasUsed: 35948,
      contractAddress: null,
      logs: [],
      from: '0xdf3f858032e370ae039417b278403ba90ab8bb64',
      to: '0xef69146474ee7fff43f78b2860518b005afae9f8',
      status: '0x0',
      logsBloom: '0x000000000000000000000000000000000000000000000'
    },
    txType: 'contract call',
    txId: '0268cdf000ae1a107721eb830b92a'
  }
}

export const eventResponse = [{
  blockNumber: 2525443,
  event: 'Transfer',
  timestamp: 1643049374,
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
    '0x000000000000000000000000df3f858032e370ae039417b278403ba90ab8bb64'
  ],
  args: [
    '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
    '0xdf3f858032e370ae039417b278403ba90ab8bb64',
    '0x56bc75e2d63100000'
  ],
  transactionHash: '0xcb08a5c3417c4d25956f7fa70d1da0f558568ad91979580664176281cfa037e9',
  txStatus: '0x1'
}]

export const rbtcBalanceResponse = [
  {
    name: 'RBTC',
    symbol: 'RBTC',
    contractAddress: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    balance: '0x056900d33ca7fc0000'

  }]
