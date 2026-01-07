import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useWalletManager } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { ConsoleOutput } from '@/components/ConsoleOutput';
import { colors } from '@/constants/colors';
import chainConfigs from '@/config/chain';

export default function ManageAccountScreen() {
  const { 
    createWallet,
    initializeWallet, 
    initializeFromMnemonic,
    createTemporaryWallet,
    deleteWallet,
    getMnemonic,
    wallets,
    activeWalletId
  } = useWalletManager(undefined, chainConfigs);

  return (
    <FeatureLayout 
      title="Wallet Management" 
      description="Create, import, and manage your wallets."
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Wallet Status</Text>
        <ConsoleOutput data={{ 
          activeWalletId: activeWalletId || 'None',
          availableWallets: wallets
        }} />
      </View>

      <ActionCard
        title="Create New Wallet"
        description="Generates a new seed phrase and saves it securely (requires biometrics)."
        fields={[
          { id: 'walletId', type: 'text', label: 'Wallet ID (Email)', placeholder: 'user@example.com' }
        ]}
        action={async ({ walletId }) => {
          await createWallet(walletId, chainConfigs);
          return { success: true, message: `Wallet ${walletId} created` };
        }}
        actionLabel="Create Wallet"
      />

      <ActionCard
        title="Load Existing Wallet"
        description="Switch to an existing wallet by ID (requires biometrics)."
        fields={[
          { id: 'walletId', type: 'text', label: 'Wallet ID', placeholder: 'user@example.com' }
        ]}
        action={async ({ walletId }) => {
          // initializeWallet({ createNew: false, walletId }) loads it.
          await initializeWallet({ createNew: false, walletId });
          return { success: true, message: `Loaded wallet ${walletId}` };
        }}
        actionLabel="Load Wallet"
      />

      <ActionCard
        title="Import from Mnemonic"
        description="Restore a wallet using a 12 or 24 word seed phrase."
        fields={[
          { id: 'walletId', type: 'text', label: 'Wallet ID (Email)', placeholder: 'user@example.com' },
          { id: 'mnemonic', type: 'json', label: 'Seed Phrase', placeholder: 'word1 word2 ... word12' }
        ]}
        action={async ({ walletId, mnemonic }) => {
          await initializeFromMnemonic(mnemonic, walletId);
          return { success: true, message: `Wallet ${walletId} imported` };
        }}
        actionLabel="Import Wallet"
      />

      <ActionCard
        title="Create Temporary Wallet"
        description="Create a throwaway wallet for testing (not saved to storage)."
        fields={[]}
        action={async () => {
          await createTemporaryWallet();
          return { success: true, message: "Temporary wallet active" };
        }}
        actionLabel="Create Temp Wallet"
      />

      <ActionCard
        title="Reveal Mnemonic"
        description="Decrypt and show the seed phrase for the active wallet."
        fields={[]}
        action={async () => {
          const phrase = await getMnemonic();
          return { mnemonic: phrase };
        }}
        actionLabel="Reveal Phrase"
      />

      <ActionCard
        title="Delete Wallet"
        description="Permanently remove a wallet from secure storage."
        fields={[
          { id: 'walletId', type: 'text', label: 'Wallet ID to Delete', placeholder: 'user@example.com' }
        ]}
        action={async ({ walletId }) => {
          await deleteWallet(walletId);
          return { success: true, message: `Wallet ${walletId} deleted` };
        }}
        actionLabel="Delete Wallet"
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
    marginBottom: 8,
  },
});