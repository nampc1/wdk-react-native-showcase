import { useState, useEffect } from 'react'
import { Text, ScrollView } from 'react-native'
import { Worklet } from 'react-native-bare-kit'
import RPC from 'bare-rpc'
import { bundle, COMMANDS, MODULES, WdkModuleMetadata } from '@tetherto/pear-wrk-wdk'

export default function () {
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    const worklet = new Worklet()

    worklet.start('/worklet.bundle', bundle)

    const { IPC } = worklet

    const rpc = new RPC(IPC, (req) => {
      console.log(req.command)
    })

    const networkConfigs: Record<string, any> = {
      ethereum: {
        chainId: 1,
        blockchain: 'ethereum',
        provider: 'https://rpc.mevblocker.io/fast',
        bundlerUrl: 'https://api.candide.dev/public/v3/ethereum',
        paymasterUrl: 'https://api.candide.dev/public/v3/ethereum',
        paymasterAddress: '0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba',
        entryPointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        safeModulesVersion: '0.3.0',
        paymasterToken: {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT
        },
        transferMaxFee: 100000 // 100,000 paymaster token units (e.g., 0.1 USDT if 6 decimals)
      },
      bitcoin: {
        network: 'testnet',
        host: 'electrum.blockstream.info',
        port: 50001
      },
      polygon: {
        chainId: 137,
        blockchain: 'polygon',
        provider: 'https://polygon-rpc.com',
        bundlerUrl: 'https://api.candide.dev/public/v3/polygon',
        paymasterUrl: 'https://api.candide.dev/public/v3/polygon',
        paymasterAddress: '0x8b1f6cb5d062aa2ce8d581942bbb960420d875ba',
        entryPointAddress: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        safeModulesVersion: '0.3.0',
        paymasterToken: {
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' // USDT on Polygon
        },
        transferMaxFee: 100000
      },
      spark: {
        network: 'REGTEST'
      },
      solana: {
        rpcUrl: 'https://api.devnet.solana.com',
        wsUrl: 'wss://api.devnet.solana.com'
      },
      tron: {
        provider: 'https://api.trongrid.io'
      },
      ton: {
        tonClient: {
          url: 'https://testnet.toncenter.com/api/v2/jsonRPC'
        }
      },
      aave: {
        provider: 'https://rpc.mevblocker.io/fast',
        transferMaxFee: 100000
      }
    }

    const run = async () => {
      const logs: string[] = []
      const appendLog = (title: string, data: any) => {
        const entry = `=== ${title} ===\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`
        console.log(entry)
        logs.push(entry)
        setResponse(logs.join('\n\n'))
      }

      try {
        const pingReq = rpc.request(COMMANDS.PING)
        pingReq.send()
        const pingRes = await pingReq.reply('utf-8')
        appendLog('PING', pingRes)

        const items: WdkModuleMetadata[] = [
          {
            type: 'wallet',
            name: 'ethereum',
            moduleName: MODULES.EVM,
            network: 'ethereum',
            config: networkConfigs.ethereum
          },
          {
            type: 'wallet',
            name: 'polygon',
            moduleName: MODULES.EVM_ERC_4337,
            network: 'polygon',
            config: networkConfigs.polygon
          },
          {
            type: 'wallet',
            name: 'bitcoin',
            moduleName: MODULES.BTC,
            network: 'bitcoin',
            config: networkConfigs.bitcoin
          },
          {
            type: 'wallet',
            name: 'spark',
            moduleName: MODULES.SPARK,
            network: 'spark',
            config: networkConfigs.spark
          },
          {
            type: 'protocol',
            name: 'aave',
            moduleName: MODULES.AAVE_EVM,
            network: 'ethereum',
            config: networkConfigs.aave
          }
        ]

        const startReq = rpc.request(COMMANDS.START)
        startReq.send(JSON.stringify({
          seedPhrase: 'seed-here',
          items
        }))
        const startRes = await startReq.reply('utf-8')
        appendLog('START', JSON.parse(startRes as string))

        const getAddressReq = rpc.request(COMMANDS.GET_ADDRESS)
        getAddressReq.send(JSON.stringify(['ethereum', 'polygon', 'bitcoin', 'spark']))
        const getAddressRes = await getAddressReq.reply('utf-8')
        appendLog('GET_ADDRESS', JSON.parse(getAddressRes as string))

        const quoteReq = rpc.request(COMMANDS.QUOTE_LENDING_SUPPLY)
        quoteReq.send(JSON.stringify([
          { chain: 'ethereum', name: 'aave' },
          { token: '0xdAC17F958D2ee523a2206206994597C13D831ec7', amount: 1000000000 }
        ]))
        const quoteRes = await quoteReq.reply('utf-8')
        appendLog('QUOTE_LENDING_SUPPLY', JSON.parse(quoteRes as string))
      } catch (err) {
        console.error(err)
        appendLog('ERROR', err)
      }
    }

    run()
  }, [])

  return <ScrollView><Text>{response}</Text></ScrollView>
}
