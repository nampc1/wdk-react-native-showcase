import { type EvmWalletConfig } from '@tetherto/wdk-wallet-evm'
import { type BtcWalletConfig } from '@tetherto/wdk-wallet-btc'
import { type SparkWalletConfig } from '@tetherto/wdk-wallet-spark'
import type { WdkConfigs } from '@tetherto/wdk-react-native-core'

const wdkConfigs: WdkConfigs<EvmWalletConfig | BtcWalletConfig | SparkWalletConfig> = {
  networks: {
    // ethereum: {
    //   blockchain: 'ethereum',
    //   config: {
    //     provider: 'https://ethereum-sepolia.gateway.tatum.io'
    //   }
    // },
    // bitcoin: {
    //   blockchain: 'bitcoin',
    //   config: {
    //     network: 'bitcoin',
    //     host: 'api.ordimint.com',
    //     port: 50001
    //   }
    // },
    spark: {
      blockchain: 'spark',
      config: {
        network: 'REGTEST'
      }
    }
  }
}

export default wdkConfigs
