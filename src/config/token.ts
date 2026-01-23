import type { AssetConfig } from '@tetherto/wdk-react-native-core'

export const tokenConfigs: AssetConfig[] = [
  // Ethereum Native
  {
    id: 'ethereum-native',
    network: 'ethereum',
    isNative: true,
    address: null,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18
  },
  // Ethereum Tokens
  {
    id: 'ethereum-usdt',
    network: 'ethereum',
    isNative: false,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6
  },
  {
    id: 'ethereum-xaut',
    network: 'ethereum',
    isNative: false,
    address: '0x68749665FF8D2d112Fa859AA293F07A622782F38',
    symbol: 'XAUT',
    name: 'Tether Gold',
    decimals: 6
  },
  {
    id: 'ethereum-usat',
    network: 'ethereum',
    isNative: false,
    address: '0x07041776f5007aca2a54844f50503a18a72a8b68',
    symbol: 'USAT',
    name: 'Tether USAT',
    decimals: 6
  }
]