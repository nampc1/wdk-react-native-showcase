import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBalancesForWallet, useRefreshBalance } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import { tokenConfigs } from '@/config/token';
import { AppAsset } from '@/entities/AppAsset';
import { RefreshCw } from 'lucide-react-native';

export default function GetBalanceScreen() {
  // Convert config to IAsset instances
  const assets = useMemo(() => AppAsset.fromConfigs(tokenConfigs), []);

  const { 
    data: balancesData, 
    isLoading, 
    error,
    refetch 
  } = useBalancesForWallet(0, assets);

  const { mutate: refreshBalance, isPending: isRefreshing } = useRefreshBalance();

  const formattedBalances = useMemo(() => {
    if (!balancesData) return [];
    return balancesData.map(b => {
      // Find the asset definition to get metadata like symbol
      const asset = assets.find(a => a.getId() === b.assetId);
      
      return {
        network: b.network,
        symbol: asset?.getSymbol() || 'Unknown',
        balance: b.balance,
        assetId: b.assetId
      };
    });
  }, [balancesData, assets]);

  return (
    <FeatureLayout 
      title="Wallet Balances" 
      description="Fetch and monitor asset balances across networks."
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Balance Query</Text>
          <TouchableOpacity 
            onPress={() => refetch()} 
            disabled={isLoading || isRefreshing}
            style={styles.refreshButton}
          >
            {isLoading || isRefreshing ? (
               <ActivityIndicator size="small" color={colors.primary} />
            ) : (
               <RefreshCw size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDesc}>
          Balances are cached and updated via TanStack Query.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Balance Data</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ alignSelf: 'flex-start', margin: 20 }} />
        ) : error ? (
          <ConsoleOutput data={error.message} error />
        ) : (
          <ConsoleOutput data={formattedBalances.length > 0 ? formattedBalances : 'No data found'} />
        )}
      </View>

      <ActionCard
        title="Force Refresh Specific Asset"
        description="Invalidate cache and fetch fresh balance for a specific token."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'assetId', type: 'text', label: 'Asset ID (Optional)', placeholder: 'e.g. ethereum-native' }
        ]}
        action={async ({ network, assetId }) => {
          refreshBalance({
            network,
            accountIndex: 0,
            assetId: assetId || undefined,
            type: assetId ? 'token' : 'network'
          });
          return { status: 'Refetch triggered' };
        }}
        actionLabel="Refresh Asset"
      />
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  refreshButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
});
