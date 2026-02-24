/** @type {import('@tetherto/wdk-worklet-bundler').WdkBundleConfig} */

module.exports = {
  networks: {
    // bitcoin: {
    //   package: '@tetherto/wdk-wallet-btc'
    // },
    // sepolia: {
    //   package: '@tetherto/wdk-wallet-evm'
    // },
    spark: {
      package: '@tetherto/wdk-wallet-spark'
    }
  },
  preloadModules: [
    '@buildonspark/spark-frost-bare-addon'
  ]
}