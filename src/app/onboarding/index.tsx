import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnBoardingWelcome } from '@/components/onboarding-welcome';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function OnBoardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCreateWallet = () => {
    router.push('/onboarding/create');
  };

  const handleImportWallet = () => {
    router.push('/onboarding/import');
  };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <OnBoardingWelcome
        title="Welcome!"
        subtitle="Set up your wallet and start exploring the crypto world."
        actionButtons={[
          {
            id: 1,
            title: 'Create Wallet',
            iconName: 'wallet',
            variant: 'filled',
            onPress: handleCreateWallet,
          },
          {
            id: 2,
            title: 'Import Wallet',
            iconName: 'download',
            variant: 'tinted',
            onPress: handleImportWallet,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});