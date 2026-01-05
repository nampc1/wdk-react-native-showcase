import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useWalletManager } from '@tetherto/wdk-react-native-core';
import { colors } from '../../constants/colors';
import chainConfigs from '../../config/chain';

export default function CreateWallet() {
  const router = useRouter();
  const { initializeWallet, getMnemonic, isInitializing, error } = useWalletManager(undefined, chainConfigs());
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    console.log("CreateWallet debug:", { mnemonic: !!mnemonic, isInitializing, error, created });
  }, [mnemonic, isInitializing, error, created]);

  const handleGenerate = async () => {
    try {
      await initializeWallet({ createNew: true });
      const phrase = await getMnemonic();
      setMnemonic(phrase);
      setCreated(true);
    } catch (e) {
      console.error("Failed to initialize wallet", e);
    }
  };

  const handleContinue = async () => {
    router.replace('/wallet');
  };

  return (
    <ScrollView style={styles.container}>
       <Text style={styles.label}>Recovery Phrase</Text>
       
       {!mnemonic && !created ? (
         <View style={styles.placeholderBox}>
            {isInitializing ? (
                <Text style={styles.placeholderText}>Generating wallet...</Text>
            ) : (
                <>
                <Text style={styles.placeholderText}>
                Generate a new recovery phrase to create your wallet.
                You may be asked for biometric authentication.
                </Text>
                <TouchableOpacity onPress={handleGenerate} disabled={isInitializing} style={styles.generateButton}>
                <Text style={styles.generateButtonText}>{isInitializing ? 'Generating...' : 'Generate Phrase'}</Text>
                </TouchableOpacity>
                </>
            )}
         </View>
       ) : (
         <View style={styles.mnemonicBox}>
           <Text style={styles.mnemonicText}>
             {mnemonic || "Wallet created successfully. Recovery phrase hidden for security."}
           </Text>
         </View>
       )}

       {error ? <Text style={styles.errorText}>Error: {error}</Text> : null}

       {(mnemonic || created) && (
         <TouchableOpacity onPress={handleContinue} style={styles.button}>
            <Text style={styles.buttonText}>{'Continue to Wallet'}</Text>
         </TouchableOpacity>
       )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  placeholderBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderText: {
    textAlign: 'center', 
    color: colors.text, 
    marginBottom: 20,
    fontSize: 14,
  },
  mnemonicBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mnemonicText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});