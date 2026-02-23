/** @type {import('@tetherto/wdk-worklet-bundler').WdkBundleConfig} */

module.exports = {
  networks: {
    bitcoin: {
      package: '@tetherto/wdk-wallet-btc'
    },
    spark: {
      package: '@tetherto/wdk-wallet-spark'
    },
    sepolia: {
      package: '@tetherto/wdk-wallet-evm'
    }
  },
  preloadModules: [
    '@buildonspark/spark-frost-bare-addon'
  ]
}