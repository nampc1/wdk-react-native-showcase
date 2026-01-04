import { DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useWorklet } from '@tetherto/wdk-react-native-core';
import { ThemeProvider } from '@tetherto/wdk-uikit-react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import chainConfigs from '@/config/chain';
import { Toaster } from 'sonner-native';
import { colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
  },
};

export default function RootLayout() {
  const {
    startWorklet,
    isWorkletStarted,
    isLoading,
    isInitialized,
    encryptedSeed,
    generateEntropyAndEncrypt,
    initializeWDK,
  } = useWorklet();

  useEffect(() => {
    const initApp = async () => {
      // If already fully initialized, do nothing
      if (isInitialized) {
        SplashScreen.hideAsync();
        return;
      }

      try {
        if (!isWorkletStarted && !isLoading) {
          await startWorklet(chainConfigs());
        }

        if (isWorkletStarted && !encryptedSeed && !isLoading) {
          const { encryptionKey, encryptedSeedBuffer } =
            await generateEntropyAndEncrypt(12);

          await initializeWDK({
            encryptionKey,
            encryptedSeed: encryptedSeedBuffer,
          });
        }
      } catch (error) {
        console.error('Failed to initialize services in app layout:', error);
      } finally {
        if (isWorkletStarted) {
            SplashScreen.hideAsync();
        }
      }
    };

    initApp();
  }, [
    isWorkletStarted,
    startWorklet,
    isInitialized,
    encryptedSeed,
    isLoading,
    generateEntropyAndEncrypt,
    initializeWDK,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        defaultMode="dark"
        brandConfig={{
          primaryColor: colors.primary,
        }}
      >
        <NavigationThemeProvider value={CustomDarkTheme}>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            />
            <StatusBar style="light" />
          </View>
        </NavigationThemeProvider>
        <Toaster
          offset={90}
          toastOptions={{
            style: {
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
            },
            titleStyle: { color: colors.text },
            descriptionStyle: { color: colors.text },
          }}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}