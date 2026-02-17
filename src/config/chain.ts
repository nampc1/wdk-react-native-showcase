import { type EvmWalletConfig } from '@tetherto/wdk-wallet-evm'
import { type BtcWalletConfig } from '@tetherto/wdk-wallet-btc'
import { type SparkWalletConfig } from '@tetherto/wdk-wallet-spark'
import type { WdkConfigs } from '@tetherto/wdk-react-native-core'

export enum NETWORK_NAME {
  BITCOIN = 'bitcoin',
  SEPOLIA = 'sepolia',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  PLASMA = 'plasma',
  SPARK = 'spark'
}

export const wdkConfigs: WdkConfigs<
  EvmWalletConfig | BtcWalletConfig | SparkWalletConfig
> = {
  networks: {
    [NETWORK_NAME.BITCOIN]: {
      blockchain: NETWORK_NAME.BITCOIN,
      config: {
        network: 'bitcoin',
        host: 'api.ordimint.com',
        port: 50001
      }
    },
    [NETWORK_NAME.SEPOLIA]: {
      blockchain: NETWORK_NAME.SEPOLIA,
      config: {
        provider: 'https://sepolia.gateway.tenderly.co',
        transferMaxFee: 10000000
      }
    },
    [NETWORK_NAME.SPARK]: {
      blockchain: NETWORK_NAME.SPARK,
      config: {
        network: 'REGTEST' // Spark network type (MAINNET, TESTNET)
      }
    }
  }
}

export default wdkConfigs
