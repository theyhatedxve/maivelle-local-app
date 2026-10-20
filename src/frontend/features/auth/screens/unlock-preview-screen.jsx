import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, Card, IconButton, Screen, ScreenHeader } from '@/frontend/components';
import { usePhaseOnePreview } from '@/frontend/features/onboarding/stores/phase-one-preview';
import { PreviewPasswordField } from '../components/preview-password-field';
import { DEMO_PASSWORDS } from '../utils/preview-validation';

export default function UnlockPreviewScreen({ scope = 'app' }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { enterPreview } = usePhaseOnePreview();
  const unlock = () => {
    if (password !== DEMO_PASSWORDS[scope]) { setError('That does not match the public demo password.'); return; }
    setPassword('');
    enterPreview();
    router.replace(scope === 'vault' ? '/(tabs)/vault' : '/(tabs)');
  };
  return <Screen keyboardAware testID={`${scope}-unlock-screen`}>
    <View className="items-start"><IconButton icon="arrow-back" label="Back from unlock preview" onPress={() => router.canGoBack() ? router.back() : router.replace('/welcome')} /></View>
    <ScreenHeader title={scope === 'vault' ? 'Unlock your Vault' : 'Welcome back'} subtitle="Unlock interface preview" />
    <Card compact><AppText tone="secondary">Demo only. This screen does not protect the app or Vault.</AppText></Card>
    <AppText selectable>Public demo password: {DEMO_PASSWORDS[scope]}</AppText>
    <Button label="Use demo password" variant="secondary" onPress={() => { setPassword(DEMO_PASSWORDS[scope]); setError(''); }} />
    <PreviewPasswordField label="Demo password" value={password} error={error} onChangeText={(value) => { setPassword(value); setError(''); }} onSubmitEditing={unlock} />
    <Button label="Try demo unlock" onPress={unlock} />
    <Button label="Recovery options" variant="secondary" onPress={() => { setPassword(''); router.push({ pathname: '/recovery', params: { scope } }); }} />
  </Screen>;
}
