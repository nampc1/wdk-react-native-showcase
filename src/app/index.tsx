import { ActivityIndicator, View } from 'react-native'
import { useWorklet } from '@tetherto/wdk-react-native-core'
import { colors } from '@/constants/colors';
import { Redirect } from 'expo-router';

// todo: init pricing service

export default function App() {
  const { isInitialized, encryptedSeed, isLoading } = useWorklet();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Redirect based on wallet existence and unlock status
  if (!encryptedSeed) {
    return <Redirect href="/onboarding" />;
  }

  // If wallet exists but is not initialized (unlocked), go to authorization
  // If wallet is already initialized (e.g., just created/imported), go directly to wallet
  return <Redirect href={isInitialized ? '/wallet' : '/authorize'} />;
}