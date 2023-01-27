# RIF Wallet Services WebSocket 1.0.0-beta.3 documentation

* Default content type: [application/json](https://www.iana.org/assignments/media-types/application/json)

RIF Wallet Services WebSocket allows you to get all updates(balances, transactions, events and prices) of a Smart Wallet.

### Check out its awesome features:

* Get tokens balance, transactions and events of smart wallet
* Get prices of all tokens available in network


## Table of Contents

* [Servers](#servers)
  * [local](#local-server)
  * [test](#test-server)
* [Operations](#operations)
  * [SUB subscribe](#sub-subscribe-operation)
  * [SUB change](#sub-change-operation)

## Servers

### `local` Server

* URL: `http://localhost:3000/ws`
* Protocol: `http`

Local Server


### `test` Server

* URL: `https://rif-wallet-services.testnet.rifcomputing.net/ws`
* Protocol: `https`

TestNet


## Operations

### SUB `subscribe` Operation

*Client can send smart wallet address to subscribe profile(balances, transactions, events) and prices*

* Operation ID: `subSmartWallet`

#### Message `SmartWallet`

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| address | string | Smart Wallet address | - | - | **required** |
| chainId | string | Network Identifier | - | - | - |
| accessToken | string | Access token to subscribe | - | - | - |

> Examples of payload _(generated)_

```json
{
  "address": "0xC0C9280C10E4D968394371d5b60aC5fCD1ae62e1",
  "chainId": "31",
  "accessToken": "string"
}
```



### SUB `change` Operation

*Client recieve profile and price updates*

* Operation ID: `subSmartWalletProfile`

Accepts **one of** the following messages:

#### Message Smart wallet token balances `tokenBalances`

*Token balances of smart wallet and network subscribed*

* Content type: [application/json](https://www.iana.org/assignments/media-types/application/json)

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| type | string | - | - | - | - |
| payload | object | - | - | - | **additional properties are allowed** |
| payload.name | string | - | - | - | - |
| payload.symbol | string | - | - | - | - |
| payload.contractAddress | string | - | - | - | - |
| payload.decimals | integer | - | - | - | - |
| payload.balance | string | - | - | - | - |

> Examples of payload _(generated)_

```json
{
  "type": "newBalance",
  "payload": {
    "name": "tRIF Token",
    "symbol": "tRif",
    "contractAddress": "0x19f64674d8a5b4e652319f5e239efd3bc969a1fe",
    "decimals": 18,
    "balance": "0x3fc0474948f360000"
  }
}
```


#### Message Transaction `Transaction`

*Smart Wallet transactions*

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| type | string | - | - | - | - |
| payload | object | - | - | - | **additional properties are allowed** |
| payload.blockHash | string | - | - | - | - |
| payload.blockNumber | integer | - | - | - | - |
| payload.from | string | - | - | - | - |
| payload.gas | integer | - | - | - | - |
| payload.gasPrice | string | - | - | - | - |
| payload.hash | string | - | - | - | - |
| payload.input | string | - | - | - | - |
| payload.nonce | integer | - | - | - | - |
| payload.r | string | - | - | - | - |
| payload.receipt | object | - | - | - | **additional properties are allowed** |
| payload.receipt.blockHash | string | - | - | - | - |
| payload.receipt.blockNumber | integer | - | - | - | - |
| payload.receipt.contractAddress | string | - | - | - | - |
| payload.receipt.cumulativeGasUsed | integer | - | - | - | - |
| payload.receipt.from | string | - | - | - | - |
| payload.receipt.gasUsed | integer | - | - | - | - |
| payload.receipt.logs | array<string> | - | - | - | - |
| payload.receipt.logs (single item) | string | - | - | - | - |
| payload.receipt.logBloom | string | - | - | - | - |
| payload.receipt.status | string | - | - | - | - |
| payload.receipt.to | string | - | - | - | - |
| payload.receipt.transactionHash | string | - | - | - | - |
| payload.receipt.tranactionIndex | string | - | - | - | - |
| payload.s | string | - | - | - | - |
| payload.timestamp | integer | - | - | - | - |
| payload.to | string | - | - | - | - |
| payload.transactionIndex | integer | - | - | - | - |
| payload.txId | string | - | - | - | - |
| payload.txType | string | - | - | - | - |
| payload.v | string | - | - | - | - |
| payload.value | string | - | - | - | - |
| payload._id | string | - | - | - | - |

> Examples of payload _(generated)_

```json
{
  "type": "newTransaction",
  "payload": {
    "blockHash": "0x1125c50d7d86a3a1f0539bd71499f113882bb9082f03b161be18edf9acfd0183",
    "blockNumber": 3123622,
    "from": "0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1",
    "gas": 32716,
    "gasPrice": "0x3e252e0",
    "hash": "0xfb9843a4ebaef4b835dd49a7a348c7133424f8b804e9766c95fca82a13ba115e",
    "input": "0x",
    "nonce": 9,
    "r": "0x5472bad7b7dfea0a7a2f278435369b9590e1c4fb479c74fc124c92a2f32bba1f",
    "receipt": {
      "blockHash": "0x1125c50d7d86a3a1f0539bd71499f113882bb9082f03b161be18edf9acfd0183",
      "blockNumber": 3123622,
      "contractAddress": "0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1",
      "cumulativeGasUsed": 172204,
      "from": "0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1",
      "gasUsed": 21811,
      "logs": [
        "string"
      ],
      "logBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "status": "0x1",
      "to": "0x79d09327df250992865cccf37f595c59cb2fcd54",
      "transactionHash": "0xfb9843a4ebaef4b835dd49a7a348c7133424f8b804e9766c95fca82a13ba115e",
      "tranactionIndex": "2"
    },
    "s": "0x12fe7d8205870a1ffff17533c0de7d30ea774a9bc706eb9c5c974520a5d6d67f",
    "timestamp": 1661491330,
    "to": "0x79d09327df250992865cccf37f595c59cb2fcd54",
    "transactionIndex": 2,
    "txId": "02fa9a6002161be18edf9acfd0183",
    "txType": "contract call",
    "v": "0x61",
    "value": "0x38d7ea4c68000",
    "_id": "630858b2e187231ee824f4c9"
  }
}
```


#### Message Token Prices `tokenPrices`

*Current token prices in fiat*

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| type | string | - | - | - | - |
| payload | object | - | - | - | - |
| payload (additional properties) | object | - | - | - | **additional properties are allowed** |
| payload.price | number | - | - | - | - |
| payload.lastUpdated | string | - | - | format (`date-time`) | - |

> Examples of payload _(generated)_

```json
{
  "type": "newPrice",
  "payload": {
    "0x2acc95758f8b5f583470ba265eb685a8f45fc9d5": {
      "price": 0.06697809474145774,
      "lastUpdated": "2022-08-26T06:56:00.000Z"
    },
    "0x4991516df6053121121274397a8c1dad608bc95b": {
      "price": "6.055157833969657,",
      "lastUpdated": "2022-08-29T00:49:00.000Z"
    }
  }
}
```


#### Message Token Transfer `tokenTransfer`

*Token Transfers*

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| type | string | - | - | - | - |
| payload | object | - | - | - | **additional properties are allowed** |
| payload.blockNumber | number | - | - | - | - |
| payload.event | string | - | - | - | - |
| payload.timestamp | integer | - | - | - | - |
| payload.topics | array<string> | - | - | - | - |
| payload.topics (single item) | string | - | - | - | - |
| payload.args | array<string> | - | - | - | - |
| payload.args (single item) | string | - | - | - | - |
| payload.transactionHash | string | - | - | - | - |
| payload.txStatus | string | - | - | - | - |

> Examples of payload _(generated)_

```json
{
  "type": "newTokenTransfer",
  "payload": {
    "blockNumber": 3123621,
    "event": "Transfer",
    "timestamp": 1661491300,
    "topics": [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    ],
    "args": [
      "0xc0c9280c10e4d968394371d5b60ac5fcd1ae62e1"
    ],
    "transactionHash": "0x61f1ad8e593e2d6f3b66107a16db9795f1f7e643f2be7074c1ef99f9d151b30a",
    "txStatus": "0x1"
  }
}
```



