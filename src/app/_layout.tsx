import { WdkAppProvider } from '@tetherto/wdk-react-native-core';
import { View, Text } from 'react-native';
import chainConfigs from '../config/chain';
import bundle from '.wdk-bundle';

export default function RootLayout() {
  return (
    <WdkAppProvider
      networkConfigs={chainConfigs}
      bundle={{ bundle }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff' }}>Minimal WDK Test</Text>
      </View>
    </WdkAppProvider>
  );
}

