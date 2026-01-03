import { useState, useEffect } from 'react'
import { Text, ScrollView, View, StyleSheet } from 'react-native'
import { useWallet, useWorklet } from '@tetherto/wdk-react-native-core'
import type { NetworkConfigs } from '@tetherto/wdk-react-native-core'

// Dummy network configuration for testing
const TEST_NETWORKS = {
  ethereum: {
    chainId: 1, // Sepolia
    blockchain: 'ethereum',
    provider: 'https://eth.llamarpc.com',
  },
  'bitcoin-testnet': {
    network: 'testnet',
    host: 'electrum.blockstream.info',
    port: '50001'
  },
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
  spark: {
  }
}

export default function App() {
  const {
    isWorkletStarted,
    isInitialized,
    isLoading,
    error,
    startWorklet,
    generateEntropyAndEncrypt,
    initializeWDK,
    encryptedSeed
  } = useWorklet()
  const { getAddress } = useWallet() 

  const [logs, setLogs] = useState<string[]>([])
  const [address, setAddress] = useState<string>()

  const log = (msg: string) => {
    console.log(`[App] ${msg}`)
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev])
  }

  useEffect(() => {
    const init = async () => {
      // If already fully initialized, do nothing
      if (isInitialized) {
        return
      }

      try {
        // Step 1: Start Worklet
        if (!isWorkletStarted && !isLoading) {
           log('Starting worklet...')
           // @ts-ignore
           await startWorklet(TEST_NETWORKS) // todo
           log('Worklet started')
        }

        // Step 2 & 3: Generate Keys and Initialize WDK
        // We check if worklet is started and we don't have a seed yet
        if (isWorkletStarted && !encryptedSeed && !isLoading) {
           log('Generating entropy...')
           const { encryptionKey, encryptedSeedBuffer } = await generateEntropyAndEncrypt(12)
           log('Entropy generated')
           
           log(encryptionKey)
           log(encryptedSeedBuffer)

           log('Initializing WDK...')
           await initializeWDK({ encryptionKey, encryptedSeed: encryptedSeedBuffer })
           log('WDK Initialized successfully')
        }
      } catch (err: any) {
        log(`Error: ${err.message || err}`)
      }
    }

    init()
  }, [isWorkletStarted, isInitialized, encryptedSeed, isLoading])
  
  useEffect(() => {
    const fetchInfo = async () => {
      if (isInitialized) {
        Promise.all(Object.keys(TEST_NETWORKS).map(async (network) => {
          const addr = await getAddress(network)
          log(network + ': ' + addr)
        }))
      }
    }
    
    fetchInfo()
  }, [isInitialized])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>WDK React Native Test</Text>

      <View style={styles.statusContainer}>
         <Text>Worklet Started: {isWorkletStarted ? '✅' : '❌'}</Text>
         <Text>WDK Initialized: {isInitialized ? '✅' : '❌'}</Text>
         <Text>Loading: {isLoading ? '⏳' : 'Idle'}</Text>
         {error && <Text style={styles.error}>Error: {error}</Text>}
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsHeader}>Logs:</Text>
        {logs.map((l, i) => <Text key={i} style={styles.logText}>{l}</Text>)}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  statusContainer: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20 },
  error: { color: 'red', marginTop: 10 },
  logsContainer: { flex: 1 },
  logsHeader: { fontWeight: 'bold', marginBottom: 10 },
  logText: { fontFamily: 'monospace', fontSize: 12, marginBottom: 4 }
})
