// we only import type to provide type safety during development, it will not be included in the app at build time.
import { type EvmWalletConfig } from '@tetherto/wdk-wallet-evm'
import type {
  WdkConfigs,
  DefaultWdkConfig
} from '@tetherto/wdk-react-native-core'

type AppEvmConfig = DefaultWdkConfig &
  EvmWalletConfig & {
    blockchain: 'ethereum' | 'polygon' | 'arbitrum'
  }

const chainConfigs: WdkConfigs<AppEvmConfig> = {
  ethereum: {
    blockchain: 'ethereum',
    provider: 'https://ethereum-sepolia.gateway.tatum.io'
  }
  // 'bitcoin-testnet': {
  //   network: 'testnet',
  //   host: 'electrum.blockstream.info',
  //   port: '50001',
  // },
  // polygon: {
  //   chainId: 137, // Sepolia
  //   blockchain: 'polygon',
  //   provider: 'https://api.zan.top/polygon-mainnet'
  // },
  // arbitrum: {
  //   chainId: 42161, // Sepolia
  //   blockchain: 'arbitrum',
  //   provider: 'https://api.zan.top/arb-one'
  // },
  // plasma: {
  //   chainId: 9745, // Sepolia
  //   blockchain: 'plasma',
  //   provider: 'https://rpc.plasma.to'
  // },
  // sepolia: {
  //   chainId: 11155111, // Sepolia
  //   blockchain: 'sepolia',
  //   provider: 'https://ethereum-sepolia.gateway.tatum.io',
  //   bundlerUrl: 'https://api.candide.dev/public/v3/sepolia',
  //   paymasterUrl: 'https://api.candide.dev/public/v3/sepolia',
  //   paymasterAddress: '0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba',
  //   entryPointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
  //   safeModulesVersion: '0.3.0',
  //   paymasterToken: {
  //     address: '0xFa5854FBf9964330d761961F46565AB7326e5a3b',
  //   }
  // },
  // spark: {},
}

export default chainConfigs
