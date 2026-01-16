/** @type {import('@tetherto/wdk-worklet-bundler').WdkBundleConfig} */

module.exports = {
  networks: {
    bitcoin: {
      package: '@tetherto/wdk-wallet-btc'
    },
    ethereum: {
      package: '@tetherto/wdk-wallet-evm'
    },
    bitcoinRegtest: {
      package: '@tetherto/wdk-wallet-btc'
    }
  },
  protocols: {
    aaveEvm: {
      package: '@tetherto/wdk-protocol-lending-aave-evm'
    }
  }
};