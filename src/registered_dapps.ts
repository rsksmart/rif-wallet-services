interface IRegisteredDapp {
    title: string,
    url: string,
    allowedNetworks: number[]
}

interface IRegisteredDappsGroup {
    groupName: string
    dapps: IRegisteredDapp[]
}

export const registeredDapps: IRegisteredDappsGroup[] = [{
  groupName: 'Sample apps',
  dapps: [{
    title: 'rLogin Sample App',
    url: 'https://basic-sample.rlogin.identity.rifos.org/',
    allowedNetworks: [31]
  }, {
    title: 'QA Sample App',
    url: 'https://rsksmart.github.io/rLogin-web3-clients-compatibility-tests/',
    allowedNetworks: [31]
  }]
}, {
  groupName: 'Dapps',
  dapps: [{
    title: 'rScheduler App',
    url: 'https://scheduler.rifos.org/',
    allowedNetworks: []
  }, {
    title: 'RNS App',
    url: 'https://testnet.manager.rns.rifos.org',
    allowedNetworks: [31]
  }, {
    title: 'RNS App',
    url: 'https://manager.rns.rifos.org',
    allowedNetworks: [30]
  }, {
    title: 'Multi-Sig App',
    url: 'https://sample-app-multisig.rifos.org/',
    allowedNetworks: [31]
  }, {
    title: 'Identity App',
    url: 'https://identity.rifos.org/',
    allowedNetworks: []
  }, {
    title: 'Email Verifier App',
    url: 'https://email-verifier.identity.rifos.org/',
    allowedNetworks: []
  }, {
    title: 'rBench App',
    url: 'https://rsksmart.github.io/rBench',
    allowedNetworks: []
  }, {
    title: 'rMarketplace App',
    url: 'https://marketplace.testnet.rifos.org/',
    allowedNetworks: []
  }]
}, {
  groupName: 'Faucets',
  dapps: [{
    title: 'RIF Faucet App',
    url: 'https://faucet.rifos.org/',
    allowedNetworks: [31]
  }, {
    title: 'Tokens Faucet App',
    url: 'https://rsksmart.github.io/rsk-token-faucet/',
    allowedNetworks: [31]
  }]
}]
