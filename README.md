<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>@rsksmart/rif-wallet-services</code></h3>
<p align="middle">
  RIF Wallet Services
</p>
<p align="middle">
  <a href="https://github.com/rsksmart/rif-wallet-services/actions/workflows/ci.yml" alt="ci">
    <img src="https://github.com/rsksmart/rif-wallet-services/actions/workflows/ci.yml/badge.svg" alt="ci" />
  </a>
  <a href="https://lgtm.com/projects/g/rsksmart/rif-wallet-services/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/rif-wallet-services" />
  </a>
  <a href='https://coveralls.io/github/rsksmart/rif-wallet-services?branch=main'>
    <img src='https://coveralls.io/repos/github/rsksmart/rif-wallet-services/badge.svg?branch=main' alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/%40rsksmart%2Frif-wallet-services">
    <img src="https://badge.fury.io/js/%40rsksmart%2Frif-wallet-services.svg" alt="npm" />
  </a>
</p>

RIF Wallet Services provide a basic account querying API to bootstrap your app.

## Usage

The API is as follows. Fin the response types in `src/types.ts`

> Use addresses in lower case

### Tokens

Get the list of all the tokens in the RSK network

```
GET /tokens -> IToken[]
```

### Addresses

Get the tokens of an address:


```
GET /address/:address/tokens -> ITokenWithBalance[]
```

Get the events related to a given address

```
GET /address/:address/events -> IEvent[]
```

Get the incoming and outgoing transactions of a given address

```
GET /address/:address/transactions -> IApiTransactions[]
```

## Run for development

Install dependencies:

```
npm i
```

Run tests:

```
npm test
npm test:watch
```

Lint the code:

```
npm run lint
npm run lint:fix
```

Start the service:

```
npm run start
npm run start:prod
```

### Branching model

- `main` has latest release. PRs need to pass `ci`. Merge into `main` will deploy to npm. Do merge commits.
- Use branches pointing to `main` to add new PRs.
- Do external PRs against latest commit in `main`.
