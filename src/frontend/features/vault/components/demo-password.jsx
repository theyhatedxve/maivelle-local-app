import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, IconButton } from '@/frontend/components';
import { DEMO_PASSWORD } from '../data/preview';

export function DemoPassword() {
  const [revealed, setRevealed] = useState(false);
  useFocusEffect(useCallback(() => {
    setRevealed(false);
    return () => setRevealed(false);
  }, []));
  return <Card compact className="gap-xs">
    <AppText variant="caption" tone="secondary">Sample password</AppText>
    <View className="flex-row items-center gap-sm">
      <AppText testID="demo-password" className="flex-1" accessibilityLabel={revealed ? `Fictional sample password: ${DEMO_PASSWORD}` : 'Sample password hidden'}>
        {revealed ? DEMO_PASSWORD : '••••••••••'}
      </AppText>
      <IconButton icon={revealed ? 'eye-off-outline' : 'eye-outline'} label={revealed ? 'Hide sample password' : 'Show sample password'} onPress={() => setRevealed(!revealed)} />
      <IconButton icon="copy-outline" label="Copy sample password unavailable" disabled accessibilityHint="Clipboard copying is not implemented in this preview." />
    </View>
  </Card>;
}
