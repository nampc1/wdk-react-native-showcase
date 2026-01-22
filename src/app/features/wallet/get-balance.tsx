import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useBalancesForWallet, useRefreshBalance } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import { tokenConfigs } from '@/config/token';
import { RefreshCw } from 'lucide-react-native';

export default function GetBalanceScreen() {
  const { 
    data: balancesData, 
    isLoading, 
    error,
    refetch 
  } = useBalancesForWallet(0, []);

  const { mutate: refreshBalance, isPending: isRefreshing } = useRefreshBalance();

  const formattedBalances = useMemo(() => {
    if (!balancesData) return [];
    return balancesData.map(b => {
      let symbol = 'Unknown';
      // @ts-ignore - Index signature mismatch potential
      const netConfig = tokenConfigs[b.network];
      
      if (netConfig) {
        if (!b.assetId) {
          symbol = netConfig.native?.symbol || 'Native';
        } else {
          const t = netConfig.tokens?.find((t: any) => t.address.toLowerCase() === b.assetId?.toLowerCase());
          if (t) symbol = t.symbol;
        }
      }

      return {
        network: b.network,
        symbol,
        balance: b.balance,
        tokenAddress: b.assetId
      };
    });
  }, [balancesData]);

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
          { id: 'tokenAddress', type: 'text', label: 'Token Address (Optional)', placeholder: 'Leave empty for native' }
        ]}
        action={async ({ network, tokenAddress }) => {
          refreshBalance({
            network,
            accountIndex: 0,
            assetId: tokenAddress || null,
            type: tokenAddress ? 'token' : 'network'
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
