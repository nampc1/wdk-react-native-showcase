import { type EvmWalletConfig } from '@tetherto/wdk-wallet-evm'
import type { WdkConfigs } from '@tetherto/wdk-react-native-core'

type AppEvmConfig = EvmWalletConfig

const wdkConfigs: WdkConfigs<AppEvmConfig> = {
  networks: {
    ethereum: {
      blockchain: 'ethereum',
      config: {
        provider: 'https://ethereum-sepolia.gateway.tatum.io'
      }
    }
  }
}

export default wdkConfigs
