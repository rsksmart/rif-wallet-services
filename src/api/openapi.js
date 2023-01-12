module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Rif Wallet Services',
    version: '1.0.0-beta.2',
    description: '[Repository](https://github.com/rsksmart/rif-wallet-services)'
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server'
    },
    {
      url: 'https://rif-wallet-services.testnet.rifcomputing.net',
      description: 'TestNet'
    }
  ],
  paths: {
    '/tokens': {
      get: {
        summary: 'Get all tokens available in network identified by chainId',
        tags: [
          'Tokens'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'chainId',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string',
              default: '31'
            },
            examples: {
              'RSK Testnet': {
                value: '31'
              },
              'RSK Mainnet': {
                value: '30'
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Token'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/address/{address}/tokens': {
      get: {
        summary: 'Get all tokens available by smart wallet address in network identified by chainId',
        tags: [
          'Tokens'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'address',
            in: 'path',
            description: 'Smart Wallet address',
            required: true,
            schema: {
              type: 'string'
            },
            example: '0x79D09327dF250992865CCCF37f595C59cB2fCd54'
          },
          {
            name: 'chainId',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string',
              default: '31'
            },
            examples: {
              'RSK Testnet': {
                value: '31'
              },
              'RSK Mainnet': {
                value: '30'
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Token'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/address/{address}/events': {
      get: {
        summary: 'Get all events(token transfers) by smart wallet address in network identified by chainId',
        tags: [
          'Events'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required:true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'address',
            in: 'path',
            required: true,
            description: 'Smart Wallet address',
            schema: {
              type: 'string'
            },
            example: '0x79D09327dF250992865CCCF37f595C59cB2fCd54'
          },
          {
            name: 'chainId',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string',
              default: '31'
            },
            examples: {
              'RSK Testnet': {
                value: '31'
              },
              'RSK Mainnet': {
                value: '30'
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Event'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/address/{address}/transactions': {
      get: {
        summary: 'Get all transactions paginated by smart wallet address in network identified by chainId',
        tags: [
          'Transactions'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'address',
            in: 'path',
            required: true,
            description: 'Smart Wallet address',
            schema: {
              type: 'string'
            },
            example: '0x79D09327dF250992865CCCF37f595C59cB2fCd54'
          },
          {
            name: 'chainId',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string',
              default: '31'
            },
            examples: {
              'RSK Testnet': {
                value: '31'
              },
              'RSK Mainnet': {
                value: '30'
              }
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Transactions limit',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'blockNumber',
            in: 'query',
            description: 'Block Number filter',
            required: false,
            schema: {
              type: 'string',
              default: '0'
            }
          },
          {
            name: 'prev',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'next',
            in: 'query',
            description: 'Chain Id identifies the network',
            required: false,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Transaction'

                      }
                    },
                    prev: {
                      type: 'string',
                      nullable: true
                    },
                    next: {
                      type: 'string',
                      nullable: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/price': {
      get: {
        summary: 'Get token prices',
        tags: [
          'Prices'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'convert',
            in: 'query',
            description: 'Currency',
            required: true,
            schema: {
              type: 'string',
              example: 'USD'
            }
          },
          {
            name: 'addresses',
            in: 'query',
            description: 'list of token address separated by comma',
            required: true,
            schema: {
              type: 'string',
              example: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5,0xefc78fc7d48b64958315949279ba181c2114abbd'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: {
                    type: 'object',
                    properties: {
                      price: {
                        type: 'double',
                        example: 0.06697809474145774
                      },
                      lastUpdated: {
                        type: 'date-time',
                        example: '2022-08-26T06:56:00.000Z'
                      }
                    }
                  },
                  example: {
                    '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5': {
                      price: 0.06697809474145774,
                      lastUpdated: '2022-08-26T06:56:00.000Z'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/dapps': {
      get: {
        tags: [
          'Dapps'
        ],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      groupName: {
                        type: 'string',
                        example: 'Sample apps'
                      },
                      dapps: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: {
                              type: 'string',
                              example: 'rLogin Sample App'
                            },
                            url: {
                              type: 'string',
                              example: 'https://basic-sample.rlogin.identity.rifos.org/'
                            },
                            allowedNetworks: {
                              type: 'array',
                              items: {
                                type: 'integer',
                                example: 31
                              }

                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/bitcoin/getXpubInfo/{xpub}': {
      get: {
        summary: 'Get public key info',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'xpub',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Public Key such as xpub, zpub, vpub'
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'Page Number'
          },
          {
            name: 'pageSize',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'Page Size Number'
          },
          {
            name: 'from',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'From Row Number'
          }
        ],
        tags: ['Bitcoin'],
        responses: {
          200: {
            description: 'Fetched the xpub information succcessfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    page: 1,
                    totalPages: 1,
                    itemsOnPage: 1000,
                    address: 'vpub5Y9pp887ENmu1P1TKY1x3g5kfV7bKEjPn8nbcHcMCwrRRbJ6' +
                      '4s4LPFdhBBqNUUigewCi3xBrqU7kqj3PpTbL61Tyubxr4P49Z1stewu2k6W',
                    balance: '10000',
                    totalReceived: '10000',
                    totalSent: '0',
                    unconfirmedBalance: '0',
                    unconfirmedTxs: 0,
                    txs: 1,
                    txids: [
                      'c0b2b9866b0073ee8047fddfa197d98de95a2b6c551dd6c45fd8f07139725005'
                    ],
                    usedTokens: 1,
                    tokens: [
                      {
                        type: 'XPUBAddress',
                        name: 'tb1qq3kcw5zs2eucc879sf8a6gr9hqnzd3yjmx4zsz',
                        path: "m/84'/1'/0'/0/0",
                        transfers: 1,
                        decimals: 8,
                        balance: '10000',
                        totalReceived: '10000',
                        totalSent: '0'
                      }
                    ]
                  }
                }
              }
            }
          },
          500: {
            description: 'Error in the API call, possible cause is wrong public key.',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'Request failed with status code 500'
                }
              }
            }
          }
        }
      }
    },
    '/bitcoin/getXpubBalance/{xpub}': {
      get: {
        summary: 'Get xPub balance',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'xpub',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Public key such as xpub, zpub, vpub'
          }
        ],
        tags: ['Bitcoin'],
        responses: {
          200: {
            description: 'Fetched the xpub balance successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    address: 'vpub5Y3owbd2JX4bzwgH4XS5RSRzSnRMX6NYjqkd31sJ' +
                      'EB5UGzqkq1v7iASC8R6vbxCWQ1xDDCm63jecwx3fkmv8FWHH5KeQeUyesrdJithe54K',
                    balance: '0',
                    totalReceived: '0',
                    totalSent: '0',
                    unconfirmedBalance: '0',
                    unconfirmedTxs: 0,
                    txs: 0,
                    btc: 0
                  }
                }
              }
            }
          },
          500: {
            description: 'Error in the API call, possible cause is wrong public key.',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'Request failed with status code 500'
                }
              }
            }
          }
        }
      }
    },
    '/bitcoin/getNextUnusedIndex/{xpub}': {
      get: {
        summary: 'Get xPub last used index of an address',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'xpub',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Public key such as xpub, zpub, vpub'
          },
          {
            name: 'bip',
            in: 'query',
            required: false,
            default: 'BIP84',
            schema: {
              type: 'string',
              enum: ['BIP44', 'BIP84']
            },
            description: 'Bitcoin Improvement Proposal (BIP) used to query blockbook instance'
          },
          {
            name: 'changeIndex',
            in: 'query',
            required: false,
            default: 0,
            schema: {
              type: 'string'
            },
            description: 'Change Index, defaults to 0 (external)'
          },
          {
            name: 'knownLastUsedIndex',
            in: 'query',
            required: false,
            default: 0,
            schema: {
              type: 'string'
            },
            description: 'Known last used index, defaults to 0'
          }
        ],
        tags: ['Bitcoin'],
        responses: {
          200: {
            description: 'Fetched the index successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    index: 0
                  }
                }
              }
            }
          },
          500: {
            description: 'An error occurred',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'Request failed with status code 500'
                }
              }
            }
          }
        }
      }
    },
    '/bitcoin/getXpubTransactions/{xpub}': {
      get: {
        summary: 'Get public key transactions',
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            required: true,
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          },
          {
            name: 'xpub',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Public Key such as xpub, zpub, vpub'
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'Page Number'
          },
          {
            name: 'pageSize',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'Page Size Number'
          },
          {
            name: 'from',
            in: 'query',
            required: false,
            schema: {
              type: 'number'
            },
            description: 'From Row Number'
          }
        ],
        tags: ['Bitcoin'],
        responses: {
          200: {
            description: 'Fetched the xpub transactions succcessfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: {
                    page: 1,
                    totalPages: 4,
                    itemsOnPage: 2,
                    address: 'vpub5ZipEGTF3j1g5FQeBncUdJ32PAWbhrwUJnMN6MJBFS' +
                      'wtDj5EJFg41ZHvVUsobryUajoE9NzhC4YgkTZabVeUqAPJXGpZerFnkteAQFM7gqo',
                    balance: '32491',
                    totalReceived: '34991',
                    totalSent: '2500',
                    unconfirmedBalance: '0',
                    unconfirmedTxs: 0,
                    txs: 8,
                    transactions: [
                      {
                        txid: 'e54087d9ab71e672e0b8971eb8b75ec6d7b771705cc743e20803f6ef1fd12331',
                        version: 2,
                        vin: [
                          {
                            txid: '7012eadca7222815a439b2722f6d015fe4706776fa049b93a120c2962477a7dc',
                            vout: 1,
                            sequence: 4294967295,
                            n: 0,
                            addresses: [
                              'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre'
                            ],
                            isAddress: true,
                            value: '100'
                          },
                          {
                            txid: 'fb6cb4962a584514130528b66d0134eef7749233becbd5453189654381fc6374',
                            sequence: 4294967295,
                            n: 1,
                            addresses: [
                              'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre'
                            ],
                            isAddress: true,
                            value: '600'
                          }
                        ],
                        vout: [
                          {
                            value: '391',
                            n: 0,
                            hex: '001449bf1e8974d8eb5a6aa490a6159b66fa9b2c2b68',
                            addresses: [
                              'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre'
                            ],
                            isAddress: true
                          },
                          {
                            value: '100',
                            n: 1,
                            hex: '0014de49104082a2eca2e79f8e36ef015a1d4860cb02',
                            addresses: [
                              'tb1qmey3qsyz5tk29eul3cmw7q26r4yxpjczmvaskp'
                            ],
                            isAddress: true
                          }
                        ],
                        blockHash: '000000000000003290c1317776bc0d887421960699320d7fc33a4d4f7c66cd5e',
                        blockHeight: 2348918,
                        confirmations: 547,
                        blockTime: 1664557725,
                        value: '491',
                        valueIn: '700',
                        fees: '209',
                        hex: '02000000000102dca7772496c220a1939b04fa766770e45f' +
                          '016d2f72b239a4152822a7dcea12700100000000ffffffff746' +
                          '3fc814365893145d5cbbe339274f7ee34016db6280513144558' +
                          '2a96b46cfb0000000000ffffffff02870100000000000016001' +
                          '449bf1e8974d8eb5a6aa490a6159b66fa9b2c2b686400000000' +
                          '000000160014de49104082a2eca2e79f8e36ef015a1d4860cb0' +
                          '20247304402200a826e661b53480707cb2a4cc914f0c0b79500' +
                          'ea7315690b96a346fb53cedf6202200f9899c96ac6a9b69a842' +
                          '3ef88bf45f26fb70a95e16c2727de9a17428cc07dd2012102bd' +
                          'ff0a9bb77e1e72b20da6d93c30edceca5b6fa2c07d5cc37e0df' +
                          '3b37cb1d1eb02473044022060fbd09ec141bc043060386896f1' +
                          '4cd063d8380565caea590c18bd0943feea8c02201169a60f072' +
                          'ff2f8f36d62921089439ca9c9eceb15f5271be4ff4e7a342467' +
                          '38012102bdff0a9bb77e1e72b20da6d93c30edceca5b6fa2c07' +
                          'd5cc37e0df3b37cb1d1eb00000000'
                      },
                      {
                        txid: '7012eadca7222815a439b2722f6d015fe4706776fa049b93a120c2962477a7dc',
                        version: 2,
                        vin: [
                          {
                            txid: 'c0b2b9866b0073ee8047fddfa197d98de95a2b6c551dd6c45fd8f07139725005',
                            vout: 1,
                            sequence: 4294967295,
                            n: 0,
                            addresses: [
                              'tb1qq3kcw5zs2eucc879sf8a6gr9hqnzd3yjmx4zsz'
                            ],
                            isAddress: true,
                            value: '10000'
                          }
                        ],
                        vout: [
                          {
                            value: '9735',
                            n: 0,
                            hex: '0014046d87505056798c1fc5824fdd2065b82626c492',
                            addresses: [
                              'tb1qq3kcw5zs2eucc879sf8a6gr9hqnzd3yjmx4zsz'
                            ],
                            isAddress: true
                          },
                          {
                            value: '100',
                            n: 1,
                            spent: true,
                            hex: '001449bf1e8974d8eb5a6aa490a6159b66fa9b2c2b68',
                            addresses: [
                              'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre'
                            ],
                            isAddress: true
                          }
                        ],
                        blockHash: '0000000000064ecd27fddacd8b08976fda8070fa96da827a9422daef205e9b38',
                        blockHeight: 2348911,
                        confirmations: 554,
                        blockTime: 1664553005,
                        value: '9835',
                        valueIn: '10000',
                        fees: '165',
                        hex: '020000000001010550723971f0d85fc4d61d556c2b5ae98dd997' +
                          'a1dffd4780ee73006b86b9b2c00100000000ffffffff02072600' +
                          '0000000000160014046d87505056798c1fc5824fdd2065b82626' +
                          'c492640000000000000016001449bf1e8974d8eb5a6aa490a615' +
                          '9b66fa9b2c2b68024830450221008e00812873470bd6a770eb3c' +
                          '52f3b7ccf046e747326f4d613767e8ee44e12a6102205d54b518' +
                          '1aa79cd1e463cd7bd161368b3797ad7c0901feb24d654ab262da' +
                          'cd4e01210261459290d6ab86fd20deb88ac9915be3766f5bbe8d' +
                          '30fa67040dff6c6c1e22c100000000'
                      }
                    ],
                    usedTokens: 6,
                    tokens: [
                      {
                        type: 'XPUBAddress',
                        name: 'tb1qhfmf4xfwyqwhphq23q9x8yp54depvff36f6avt',
                        path: "m/84'/1'/0'/0/1",
                        transfers: 1,
                        decimals: 8,
                        balance: '1000',
                        totalReceived: '1000',
                        totalSent: '0'
                      },
                      {
                        type: 'XPUBAddress',
                        name: 'tb1qfxl3azt5mr44564yjznptxmxl2djc2mg9w6qre',
                        path: "m/84'/1'/0'/0/5",
                        transfers: 4,
                        decimals: 8,
                        balance: '30391',
                        totalReceived: '31091',
                        totalSent: '700'
                      },
                      {
                        type: 'XPUBAddress',
                        name: 'tb1qmey3qsyz5tk29eul3cmw7q26r4yxpjczmvaskp',
                        path: "m/84'/1'/0'/0/14",
                        transfers: 1,
                        decimals: 8,
                        balance: '100',
                        totalReceived: '100',
                        totalSent: '0'
                      },
                      {
                        type: 'XPUBAddress',
                        name: 'tb1qsgryk684lj9js8vk0h22q4zk6udrlwdnw7kzr5',
                        path: "m/84'/1'/0'/0/24",
                        transfers: 1,
                        decimals: 8,
                        balance: '1000',
                        totalReceived: '1000',
                        totalSent: '0'
                      }
                    ]
                  }
                }
              }
            }
          },
          500: {
            description: 'Error in the API call, possible cause is wrong public key.',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'Request failed with status code 500'
                }
              }
            }
          }
        }
      }
    },
    '/request-auth/{did}':{
      get: {
        summary: 'Get challenge to sign with EOA Account. Only use when you are signed up',
        parameters: [
          {
            name: 'did',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Descentralized identifier',
            example: 'did:ethr:rsk:testnet:0xa53B0DcDBE308DFE866CCA2A0ccDa34CC5b4A0e2'
          },
        ],
        tags: [
          'Authentication'
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    challenge: {
                      type: 'string'
                    }
                  },
                  example: {
                    challenge: '27439acf4adb03fe8c2264f579c90863131897ee2d081d66a7eaeb3d3793132c'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/request-signup/{did}':{
      get: {
        summary: 'Get challenge to sign with EOA Account. Only use first time to sign up',
        parameters: [
          {
            name: 'did',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Descentralized identifier',
            example: 'did:ethr:rsk:testnet:0xa53B0DcDBE308DFE866CCA2A0ccDa34CC5b4A0e2'
          },
        ],
        tags: [
          'Authentication'
        ],
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    challenge: {
                      type: 'string'
                    }
                  },
                  example: {
                    challenge: '27439acf4adb03fe8c2264f579c90863131897ee2d081d66a7eaeb3d3793132c'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/signup': {
      post: {
        summary: 'Sign up new wallet',
        tags: ['Authentication'],
        requestBody: {
          describe: 'Register new wallet after validate signed message',
          content: {
            'application/json':{
              schema: {
                type: 'object',
                properties: {
                  response: {
                    type: 'object',
                    properties: {
                      did: {
                        type: 'string',
                        example: 'did:ethr:rsk:testnet:0xa53B0DcDBE308DFE866CCA2A0ccDa34CC5b4A0e2'
                      },
                      sig: {
                        type: 'string',
                        example: '0x08650ca562e690db34fd6f1d5a5faab1374ee07d19994a0bf808f7a3810418c406c907a06a61f7f500486cc154a4590edd4069338ce7b0367b0094e1fe44a6db1b'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NDM4NDIzIiwiZXhwIjoiMTY2ODQzOTAyMyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg0Mzg0MjMiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.jc8ENaodwOqGUy6U9Bx3zUxvm3ZMkO8qy9yN3aNcUh9UU0ffBrkFARHvPMv7-cyJtHOGJnQ_KmfYzwvoF7mthw'
                    },
                    refreshToken: {
                      type: 'string',
                      example: '4c86c31baf3420653012ac3eb0fc08ab2eb64d66c062dbc8c751fe1b3ecdb003373e15441f8ce8259358eaaab079050def7a3b9ba322332eeb0b497b3eed603f'
                    }
                  },
                }
              }
            }
          },
          401: {
            description: 'Invalid Challenge Response',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'INVALID_CHALLENGE_RESPONSE'
                }
              }
            }
          }
        }
      }
    },
    '/auth': {
      post: {
        summary: 'Login a wallet',
        tags: ['Authentication'],
        requestBody: {
          describe: 'Login to get credentials after validate signed message',
          content: {
            'application/json':{
              schema: {
                type: 'object',
                properties: {
                  response: {
                    type: 'object',
                    properties: {
                      did: {
                        type: 'string',
                        example: 'did:ethr:rsk:testnet:0xa53B0DcDBE308DFE866CCA2A0ccDa34CC5b4A0e2'
                      },
                      sig: {
                        type: 'string',
                        example: '0x08650ca562e690db34fd6f1d5a5faab1374ee07d19994a0bf808f7a3810418c406c907a06a61f7f500486cc154a4590edd4069338ce7b0367b0094e1fe44a6db1b'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NDM4NDIzIiwiZXhwIjoiMTY2ODQzOTAyMyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg0Mzg0MjMiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.jc8ENaodwOqGUy6U9Bx3zUxvm3ZMkO8qy9yN3aNcUh9UU0ffBrkFARHvPMv7-cyJtHOGJnQ_KmfYzwvoF7mthw'
                    },
                    refreshToken: {
                      type: 'string',
                      example: '4c86c31baf3420653012ac3eb0fc08ab2eb64d66c062dbc8c751fe1b3ecdb003373e15441f8ce8259358eaaab079050def7a3b9ba322332eeb0b497b3eed603f'
                    }
                  },
                }
              }
            }
          },
          401: {
            description: 'Invalid Challenge Response',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: 'INVALID_CHALLENGE_RESPONSE'
                }
              }
            }
          }
        }
      }
    },
    '/refresh-token': {
      post: {
        summary: 'Refresh credentials(access and refresh tokens)',
        tags: ['Authentication'],
        requestBody: {
          describe: 'Get new valid credentials',
          content: {
            'application/json':{
              schema: {
                type: 'object',
                properties: {
                  refreshToken: {
                    type: 'string',
                    example: 'f61004be14b3ca2785bcadcb522caed5abd9d4bc5dd669978d3fd11cdc152261c9a3793ef481551df759ded02d14e946030bd1359c597e8d0e963b60217d19ad'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NDM4NDIzIiwiZXhwIjoiMTY2ODQzOTAyMyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg0Mzg0MjMiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.jc8ENaodwOqGUy6U9Bx3zUxvm3ZMkO8qy9yN3aNcUh9UU0ffBrkFARHvPMv7-cyJtHOGJnQ_KmfYzwvoF7mthw'
                    },
                    refreshToken: {
                      type: 'string',
                      example: '4c86c31baf3420653012ac3eb0fc08ab2eb64d66c062dbc8c751fe1b3ecdb003373e15441f8ce8259358eaaab079050def7a3b9ba322332eeb0b497b3eed603f'
                    }
                  },
                }
              }
            }
          }
        }
      }
    },
    'logout': {
      post: {
        summary: 'Logout a wallet',
        tags: ['Authentication'],
        parameters: [
          {
            in: 'header',
            name: 'Authorization',
            schema: {
              type: 'string',
              example: 'DIDAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOiIxNjY4NTY1Mzc5IiwiZXhwIjoiMTY2ODU2NTk3OSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsInN1YiI6ImRpZDpldGhyOnJzazp0ZXN0bmV0OjB4YTUzQjBEY0RCRTMwOERGRTg2NkNDQTJBMGNjRGEzNENDNWI0QTBlMiIsIm5iZiI6IjE2Njg1NjUzNzkiLCJpc3MiOiJkaWQ6ZXRocjpyc2s6dGVzdG5ldDoweDQ1ZURGNjM1MzJiNGRENWVlMTMxZTA1MzBlOUZCMTJmN0RBMTkxNWMifQ.5-IOi09bwr0PrROBNBPmksNLiYYdOmhFAkJj6q-9RwzK1Uw9kb_WflMCHJntogSTcc7ihXP346vPvX86-2RUOA'
            }
          }
        ],
        responses: {
          200: {
            description: 'successful operation'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Token: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Dollar on Chain'
          },
          logo: {
            type: 'string',
            example: 'doc.png'
          },
          symbol: {
            type: 'string',
            example: 'DOC'
          },
          contractAddress: {
            type: 'string',
            example: '0x54c598fa101b6dfab4ee130e11fd0a05c646802d'
          },
          decimals: {
            type: 'integer',
            example: 18
          }
        }
      },
      Event: {
        type: 'object',
        properties: {
          args: {
            type: 'array',
            items: {
              type: 'string',
              example: '0x79d09327df250992865cccf37f595c59cb2fcd54'
            }
          },
          blockNumber: {
            type: 'integer',
            example: 3100279
          },
          event: {
            type: 'string',
            example: 'Transfer'
          },
          timestamp: {
            type: 'integer',
            example: 1660748791
          },
          topics: {
            type: 'array',
            items: {
              type: 'string',
              example: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            }
          },
          transactionHash: {
            type: 'string',
            example: '0x9b2f7d17072730ea7a5a303045970a24b48f5147950052c80b45b1d9f1776744'
          },
          txStatus: {
            type: 'string',
            example: '0x1'
          }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          blockHash: {
            type: 'string',
            example: '0x1125c50d7d86a3a1f0539bd71499f113882bb9082f03b161be18edf9acfd0183'
          },
          blockNumber: {
            type: 'integer',
            example: 3123622
          },
          from: {
            type: 'string',
            example: '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1'
          },
          gas: {
            type: 'integer',
            example: 32716
          },
          gasPrice: {
            type: 'string',
            example: '0x3e252e0'
          },
          hash: {
            type: 'string',
            example: '0xfb9843a4ebaef4b835dd49a7a348c7133424f8b804e9766c95fca82a13ba115e'
          },
          input: {
            type: 'string',
            example: '0x'
          },
          nonce: {
            type: 'integer',
            example: 9
          },
          r: {
            type: 'string',
            example: '0x5472bad7b7dfea0a7a2f278435369b9590e1c4fb479c74fc124c92a2f32bba1f'
          },
          receipt: {
            type: 'object',
            properties: {
              blockHash: {
                type: 'string',
                example: '0x1125c50d7d86a3a1f0539bd71499f113882bb9082f03b161be18edf9acfd0183'
              },
              blockNumber: {
                type: 'integer',
                example: 3123622
              },
              contractAddress: {
                type: 'string',
                example: '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1'
              },
              cumulativeGasUsed: {
                type: 'integer',
                example: 172204
              },
              from: {
                type: 'string',
                example: '0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1'
              },
              gasUsed: {
                type: 'integer',
                example: 21811
              },
              logs: {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              logBloom: {
                type: 'string',
                example: '0x00000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '00000000000000000000000000000000000000000000000000000000000' +
                  '0000000000000000000000000000000000000000000000000'
              },
              status: {
                type: 'string',
                example: '0x1'
              },
              to: {
                type: 'string',
                example: '0x79d09327df250992865cccf37f595c59cb2fcd54'
              },
              transactionHash: {
                type: 'string',
                example: '0xfb9843a4ebaef4b835dd49a7a348c7133424f8b804e9766c95fca82a13ba115e'
              },
              tranactionIndex: {
                type: 'string',
                example: 2
              }
            }
          },
          s: {
            type: 'string',
            example: '0x12fe7d8205870a1ffff17533c0de7d30ea774a9bc706eb9c5c974520a5d6d67f'
          },
          timestamp: {
            type: 'integer',
            example: '1661491330'
          },
          to: {
            type: 'string',
            example: '0x79d09327df250992865cccf37f595c59cb2fcd54'
          },
          transactionIndex: {
            type: 'integer',
            example: 2
          },
          txId: {
            type: 'string',
            example: '02fa9a6002161be18edf9acfd0183'
          },
          txType: {
            type: 'string',
            example: 'contract call'
          },
          v: {
            type: 'string',
            example: '0x61'
          },
          value: {
            type: 'string',
            example: '0x38d7ea4c68000'
          },
          _id: {
            type: 'string',
            example: '630858b2e187231ee824f4c9'
          }
        }
      }
    }
  }
}
