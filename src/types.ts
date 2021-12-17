export interface IApiTokens {
  address: string;
  balance: string;
  blockNumber: number;
  isNative: false;
  name: string;
  symbol: string;
  totalSupply: number;
  type: string;
  contract: string;
  contractInterfaces: string[];
  contractMethods: string[];
  decimals: string;
}

export interface TokensServerResponse {
  data: IApiTokens[];
}

export interface IToken {
  name: string;
  logo: string;
  symbol: string;
  contractAddress: string;
  decimals: number;
}

export interface ITokenWithBalance extends IToken {
  balance: string;
}

export interface IApiEvents {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  event: string;
  timestamp: number;
  topics: string[];
  args: string[];
  transactionHash: string;
  transactionIndex: number;
  txStatus: string;
}

export interface IEvent {
  blockNumber: number;
  event: string;
  timestamp: number;
  topics: string[];
  args: string[];
  transactionHash: string;
  txStatus: string;
}

export interface EventsServerResponse {
  data: IApiEvents[];
}

export interface IApiTransactions {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  gas: number;
  gasPrice: string;
  value: string;
  input: string;
  timestamp: number;
  receipt: any;
  txType: string;
  txId: string;
}

export interface TransactionsServerResponse {
  data: IApiTransactions[];
}

export interface IMetadataParams {
  id?: string;
  slug?: string;
  symbol?: string;
  address?: string;
  axus?: string
}

export interface IContractAddress {
  'contract_address': string;
  platform: {
    name: string;
    coin: {
      id: string;
      name: string;
      symbol: string;
      slug: string;
    }
  }
}
export interface ICryptocurrencyMetadata {
  id: string,
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string,
  logo: string;
  subreddit: string;
  notice: string;
  tags: Array<string>;
  'tag-names': Array<string>;
  'tag-groups': Array<string>;
  urls: {
    website: Array<string>;
    'technical_doc': Array<string>;
    reddit: Array<string>;
    twitter: Array<string>;
    'message_board': Array<string>;
    chat: Array<string>;
    explorer: Array<string>;
    'source_code': Array<string>;
  }
  platform: IPlatform | null;
  'date_added': string;
  'twitter_username': string | null;
  'is_hidden': string;
  'date_launched': string;
  'contract_address': Array<IContractAddress>
}

export interface IPricesQuery {
  fiat: string;
  tokens: string;
}
