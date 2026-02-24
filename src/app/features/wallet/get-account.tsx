import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWallet } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';

export default function GetAccountScreen() {
  const { addresses, getNetworkAddresses, getAddress, callAccountMethod } = useWallet();

  return (
    <FeatureLayout
      title="Wallet Addresses"
      description="Inspect cached addresses and derive new ones on-demand."
    >
      <ActionCard
        title="Create Lightning Invoice"
        description="Create a new Lightning invoice for a hardcoded amount of 100 sats."
        fields={[]}
        action={async () => {
          return callAccountMethod('spark', 0, 'createLightningInvoice', { amountSats: 100 });
        }}
        actionLabel="Create Invoice"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cached Addresses Map</Text>
        <Text style={styles.sectionSubtitle}>All addresses derived and cached in memory. Note: You must derive an address first.</Text>
        <ConsoleOutput data={addresses} />
      </View>

      <ActionCard
        title="Get Network Addresses"
        description="Retrieve all cached addresses for a specific network."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' }
        ]}
        action={async ({ network }) => {
          return getNetworkAddresses(network);
        }}
        actionLabel="Fetch Map"
      />

      {/* 3. Get Specific Address */}
      <ActionCard
        title="Derive Address"
        description="Derive a specific address index."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' }
        ]}
        action={async ({ network, index }) => {
          const addr = await getAddress(network, parseInt(index));
          return {
            network,
            index,
            address: addr
          };
        }}
        actionLabel="Get Address"
      />
    </FeatureLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});
