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
export interface IApiRbtcBalance {
  _id: string,
  address: string,
  balance: string,
  blockHash: string,
  blockNumber: number,
  timestamp: number,
  _created: number
}

export interface RbtcBalancesServerResponse {
  data: IApiRbtcBalance[];
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

export interface Page {
  next: string | null
  prev: string | null
}
export interface TransactionsServerResponse {
  data: IApiTransactions[];
  pages: Page;
}

export interface ChannelServerResponse {
  channel: string;
  action: string;
  data: TransactionsServerResponse
}

export interface TransactionServerResponse {
  data: IApiTransactions
}

export interface IAction {
  callType: string;
  from: string;
  to: string;
  gas: string;
  input: string;
  value: string;
}

export interface IResult {
  gasUsed: string;
  output: string;
}

export interface IInternalTransaction {
  _id: string;
  action: IAction;
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionPosition: number;
  type: string;
  subtraces: number;
  traceAddress: number[];
  result: IResult;
  _index: number;
  timestamp: number;
  internalTxId: string;
}

export interface InternalTransactionServerResponse {
  data: IInternalTransaction[]
}
