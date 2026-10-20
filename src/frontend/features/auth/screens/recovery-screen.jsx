import { router, useLocalSearchParams } from 'expo-router';
import { AppText, Button, Card, Screen, ScreenHeader } from '@/frontend/components';

export default function RecoveryScreen() {
  const { scope } = useLocalSearchParams();
  return <Screen testID="recovery-screen">
    <ScreenHeader title="Recovery options" subtitle="Recovery interface preview" />
    <Card><AppText>No reset or recovery key is available yet. App and Vault protection will be implemented with encrypted storage in Phase 3.</AppText></Card>
    <AppText tone="secondary">The demo does not have an account, recovery email, or saved password. Use the public demo password on the unlock screen to explore the flow.</AppText>
    <Button label="Return to unlock preview" onPress={() => router.replace(scope === 'vault' ? '/vault-unlock' : '/unlock')} />
  </Screen>;
}
