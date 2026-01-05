import { RefreshCw } from 'lucide-react-native';
import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet, useBalancesForWallet, useRefreshBalance } from '@tetherto/wdk-react-native-core';
import { colors } from '@/constants/colors';
import chainConfigs from '@/config/chain';
import { tokenConfigs } from '@/config/token';

interface Asset {
  symbol: string;
  name: string;
  network: string;
  address: string;
  balance: string;
  usdValue: string;
  color: string;
  logo?: any;
}

const ASSET_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  USDT: '#009393',
  XAUT: '#D4AF37',
  USAT: '#2B2B2B',
  DEFAULT: '#999999',
};

const TOKEN_LOGOS: Record<string, any> = {
  BTC: require('../../assets/images/tokens/bitcoin-btc-logo.png'),
  ETH: require('../../assets/images/chains/ethereum-eth-logo.png'),
  USDT: require('../../assets/images/tokens/tether-usdt-logo.png'),
  XAUT: require('../../assets/images/tokens/tether-xaut-logo.png'),
};

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { isInitialized, getAddress } = useWallet();
  const { data: balancesData, isLoading: balancesLoading, refetch: refetchBalances } = useBalancesForWallet(0, tokenConfigs);
  
  const [refreshing, setRefreshing] = useState(false);
  const [addresses, setAddresses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isInitialized) return;
      const chains = chainConfigs();
      const newAddresses: Record<string, string> = {};

      for (const key of Object.keys(chains)) {
        try {
          const addr = await getAddress(key, 0);
          newAddresses[key] = addr;
        } catch (e) {
          console.warn(`Failed to get address for ${key}`, e);
        }
      }
      setAddresses(newAddresses);
    };

    fetchAddresses();
  }, [isInitialized]);

  const assets = useMemo(() => {
      if (!isInitialized || !balancesData) return [];
      
      const chains = chainConfigs();
      const newAssets: Asset[] = [];

      Object.entries(chains).forEach(([networkKey, chainConfig]) => {
        const address = addresses[networkKey];
        if (!address) return;

        // Native Asset
        const nativeConfig = tokenConfigs[networkKey as keyof typeof tokenConfigs]?.native;
        if (nativeConfig) {
            // Find balance in balancesData
            const balanceData = balancesData.find(b => b.network === networkKey && b.tokenAddress === null);
            const balance = balanceData?.balance || '0';

            newAssets.push({
                symbol: nativeConfig.symbol,
                name: nativeConfig.name,
                network: networkKey,
                address: address,
                balance: balance,
                usdValue: '0.00',
                color: ASSET_COLORS[nativeConfig.symbol] || ASSET_COLORS.DEFAULT,
                logo: TOKEN_LOGOS[nativeConfig.symbol],
            });
        }

        // Tokens
        const tokens = tokenConfigs[networkKey as keyof typeof tokenConfigs]?.tokens || [];
        tokens.forEach(token => {
             // Find balance in balancesData
            const balanceData = balancesData.find(b => b.network === networkKey && b.tokenAddress === token.address);
            const balance = balanceData?.balance || '0';
            
            newAssets.push({
                symbol: token.symbol,
                name: token.name,
                network: networkKey,
                address: address,
                balance: balance,
                usdValue: '0.00',
                color: ASSET_COLORS[token.symbol] || ASSET_COLORS.DEFAULT,
                logo: TOKEN_LOGOS[token.symbol],
            });
        });
      });
      return newAssets;
  }, [isInitialized, addresses, balancesData]);


  const totalBalance = "$0.00"; // Mock total for now

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchBalances();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Portfolio</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Value</Text>
          <Text style={styles.balanceValue}>{totalBalance}</Text>
        </View>

        {/* Asset List */}
        <Text style={styles.sectionTitle}>Assets & Addresses</Text>
        
        <View style={styles.assetList}>
          {assets.length === 0 ? (
            <Text style={{color: colors.textSecondary, textAlign: 'center', marginTop: 20}}>
              {isInitialized && !balancesLoading ? 'No assets found' : 'Initializing...'}
            </Text>
          ) : (
            assets.map((asset, index) => (
              <View key={index} style={styles.assetCard}>
                <View style={styles.assetHeader}>
                  {asset.logo ? (
                     <Image source={asset.logo} style={styles.assetIcon} resizeMode="contain" />
                  ) : (
                    <View style={[styles.iconPlaceholder, { backgroundColor: asset.color }]}>
                      <Text style={styles.iconText}>{asset.symbol[0]}</Text>
                    </View>
                  )}
                  <View style={styles.assetNameContainer}>
                    <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                    <Text style={styles.assetNetwork}>{asset.network}</Text>
                  </View>
                  <View style={styles.assetBalanceContainer}>
                    <Text style={styles.assetBalance}>{asset.balance}</Text>
                    <Text style={styles.assetUsd}>${asset.usdValue}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.addressContainer}>
                  <Text style={styles.addressLabel}>Address:</Text>
                  <View style={styles.addressRow}>
                    <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                      {asset.address}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  refreshButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },
  balanceCard: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  assetList: {
    gap: 16,
  },
  assetCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  assetNameContainer: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  assetNetwork: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  assetBalanceContainer: {
    alignItems: 'flex-end',
  },
  assetBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  assetUsd: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
    opacity: 0.5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  addressRow: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});
