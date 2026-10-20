import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, Card, IconButton, Screen, ScreenHeader } from '@/frontend/components';
import { PreviewPasswordField } from '@/frontend/features/auth/components/preview-password-field';
import { DEMO_PASSWORDS, validateSetupPassword } from '@/frontend/features/auth/utils/preview-validation';
import { usePhaseOnePreview } from '../stores/phase-one-preview';

export default function SetupScreen() {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const { enterPreview } = usePhaseOnePreview();
  const scope = step === 0 ? 'app' : 'vault';
  const changeStep = (next) => { setPassword(''); setConfirmation(''); setError(''); setStep(next); };
  const next = () => {
    const message = validateSetupPassword(password, confirmation);
    setError(message);
    if (!message) changeStep(step + 1);
  };
  return <Screen keyboardAware testID="setup-screen">
    <View className="items-start"><IconButton icon="arrow-back" label="Back from setup" onPress={() => step ? changeStep(step - 1) : router.replace('/welcome')} /></View>
    <ScreenHeader title={['Your app password', 'Your Vault password', 'Recovery, explained'][step]} subtitle={`Setup preview · Step ${step + 1} of 3`} />
    <Card compact><AppText tone="secondary">Demo only. Nothing is saved or protected. Use the provided demo values, never a real password.</AppText></Card>
    {step < 2 ? <>
      <AppText>{step === 0 ? 'The future app lock will protect access to Maivelle.' : 'A separate Vault password will protect your credentials.'}</AppText>
      <Button label="Use demo values" variant="secondary" onPress={() => { setPassword(DEMO_PASSWORDS[scope]); setConfirmation(DEMO_PASSWORDS[scope]); setError(''); }} />
      <PreviewPasswordField key={`${step}-password`} label="Demo password" value={password} onChangeText={(value) => { setPassword(value); setError(''); }} />
      <PreviewPasswordField key={`${step}-confirmation`} label="Confirm demo password" value={confirmation} error={error} onChangeText={(value) => { setConfirmation(value); setError(''); }} />
      <Button label="Continue" onPress={next} />
    </> : <>
      <AppText>Recovery will use an offline recovery key when encrypted storage is implemented. Keep that key separately from your device.</AppText>
      <AppText tone="secondary">No recovery key exists in this preview. Completing these steps does not enable a lock or change your data.</AppText>
      <Button label="Export recovery key — unavailable" disabled />
      <Button label="Open app preview" onPress={() => { enterPreview(); router.replace('/(tabs)'); }} />
    </>}
  </Screen>;
}
