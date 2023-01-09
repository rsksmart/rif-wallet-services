import { ethers } from 'ethers'

export class MockProvider extends ethers.providers.BaseProvider {
  getBalance ():
    Promise<ethers.BigNumber> {
    return Promise.resolve(ethers.BigNumber.from('0x56900d33ca7fc0000'))
  }
}
