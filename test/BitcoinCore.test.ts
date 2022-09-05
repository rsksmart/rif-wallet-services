import BitcoinCore from '../src/service/bitcoin/BitcoinCore'
// eslint-disable-next-line max-len
// const randomMnemonic = 'creek joy sea brain gravity execute month two voyage process bind coffee ecology body depend artwork erode punch episode unfair alpha amount cart clip'
// eslint-disable-next-line max-len
const vpub = 'vpub5Y3owbd2JX4bzwgH4XS5RSRzSnRMX6NYjqkd31sJEB5UGzqkq1v7iASC8R6vbxCWQ1xDDCm63jecwx3fkmv8FWHH5KeQeUyesrdJithe54K'
describe('BitcoinCore unit tests', () => {
  test('Fetch a bitcoin tesnet xpub information', async () => {
    const xpubData = await BitcoinCore.getXpubInfo(vpub)
    const properties = ['balance', 'btc', 'address', 'totalReceived', 'totalSent']
    for (const prop of properties) {
      expect(xpubData).toHaveProperty(prop)
    }
  })
})
