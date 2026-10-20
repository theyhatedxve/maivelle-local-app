import { useCallback, useRef, useState } from 'react';
import { AppState, Platform, Switch, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { AppText, Button, Card, IconButton, Screen, ScreenHeader, TextField } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { generatePassword } from '../utils/generate-password';

const LABELS = { uppercase: 'Uppercase (A–Z)', lowercase: 'Lowercase (a–z)', numbers: 'Numbers (0–9)', symbols: 'Symbols (!@#)' };

export default function PasswordGeneratorScreen() {
  const theme = useAppTheme();
  const [lengthText, setLengthText] = useState('20');
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const operation = useRef(0);
  const clear = useCallback(() => { operation.current++; setPassword(''); setVisible(false); setBusy(false); setError(''); }, []);
  useFocusEffect(useCallback(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state !== 'active') clear(); });
    return () => { subscription.remove(); clear(); };
  }, [clear]));
  const length = Number(lengthText);
  const validLength = /^\d+$/.test(lengthText) && Number.isInteger(length) && length >= 8 && length <= 128;
  const hasGroup = Object.values(options).some(Boolean);
  const generate = async () => {
    clear();
    const token = operation.current;
    setBusy(true);
    try {
      // Loading here allows older development APKs to open the app safely.
      const crypto = await import('expo-crypto');
      const result = await generatePassword({ length, options }, (count) => crypto.getRandomBytesAsync(count));
      if (operation.current === token) setPassword(result);
    } catch {
      if (operation.current === token) setError('Secure generation is unavailable. On Android, install the updated development APK with Expo Crypto. On web, use localhost or HTTPS. No password was generated.');
    } finally {
      if (operation.current === token) setBusy(false);
    }
  };
  return <Screen keyboardAware testID="password-generator-screen">
    <View className="items-start"><IconButton icon="arrow-back" label="Back from password generator" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/more')} /></View>
    <ScreenHeader title="Generate password" subtitle="Create a password with secure device randomness." />
    <Card compact>
      <AppText variant="caption" tone="secondary">Generated password</AppText>
      <AppText selectable={visible} accessibilityLabel={password ? (visible ? 'Generated password revealed' : 'Generated password hidden') : 'No generated password'}>{password ? (visible ? password : '••••••••••••') : 'Generate a password below.'}</AppText>
      <Button label={visible ? 'Hide password' : 'Reveal password'} variant="secondary" disabled={!password} onPress={() => setVisible(!visible)} />
    </Card>
    <View className="gap-sm">
      <TextField label="Password length" hint="8 to 128 characters" value={lengthText} keyboardType="number-pad" maxLength={3}
        error={validLength ? '' : 'Choose a whole number from 8 to 128.'} onChangeText={(value) => { clear(); setLengthText(value); }} />
      <View className="flex-row gap-md">
        <IconButton icon="remove" label="Decrease password length" disabled={!validLength || length <= 8} onPress={() => { clear(); setLengthText(String(length - 1)); }} />
        <IconButton icon="add" label="Increase password length" disabled={!validLength || length >= 128} onPress={() => { clear(); setLengthText(String(length + 1)); }} />
      </View>
    </View>
    <Card compact>{Object.entries(LABELS).map(([key, label]) => <View key={key} className="flex-row items-center justify-between gap-md" style={{ minHeight: theme.layout.minimumTouchTarget }}>
      <View className="flex-1"><AppText>{label}</AppText></View>
      <Switch accessibilityLabel={label} value={options[key]} thumbColor={theme.colors.onPrimary} trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        {...(Platform.OS === 'web' ? { activeThumbColor: theme.colors.onPrimary } : {})}
        onValueChange={(value) => { clear(); setOptions((current) => ({ ...current, [key]: value })); }} />
    </View>)}</Card>
    {!hasGroup && <AppText tone="error">Select at least one character group.</AppText>}
    {!!error && <AppText tone="error" accessibilityRole="alert">{error}</AppText>}
    <Button label="Generate new password" loading={busy} disabled={!validLength || !hasGroup} onPress={generate} />
    <Button label="Save to Vault — unavailable" disabled />
    <AppText variant="caption" tone="secondary">Each selected group is included. Output stays on this screen and clears when you leave or background the app. Copying and encrypted Vault saving are not available yet.</AppText>
  </Screen>;
}
