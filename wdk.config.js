/** @type {import('@tetherto/wdk-worklet-bundler').WdkBundleConfig} */

module.exports = {
  networks: {
    ethereum: {
      package: '@tetherto/wdk-wallet-evm'
    }
  }
};