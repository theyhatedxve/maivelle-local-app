import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, IconButton, Screen, ScreenHeader, TextField } from '@/frontend/components';
import { VaultPreviewNotice } from '../components/vault-preview-notice';
import { DemoPassword } from '../components/demo-password';
import { VAULT_DEMO_RECORDS } from '../data/preview';

const empty = { title: '', username: '', website: '', tag: '', notes: '' };

export default function CredentialFormScreen() {
  const { sample } = useLocalSearchParams();
  const [form, setForm] = useState(() => ({ ...empty, ...VAULT_DEMO_RECORDS.find((record) => record.id === sample) }));
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/vault');
  return <Screen keyboardAware contentClassName="gap-lg" testID="credential-form">
    <View className="flex-row items-center gap-md">
      <IconButton icon="arrow-back" label="Back from credential form" onPress={back} />
      <AppText variant="caption" tone="secondary">Form preview</AppText>
    </View>
    <ScreenHeader title={sample ? 'Credential form' : 'Add credential'} subtitle="Explore the form with fictional sample values." />
    <VaultPreviewNotice />
    <Button label="Fill demo values" variant="secondary" onPress={() => setForm({ ...VAULT_DEMO_RECORDS[0] })} />
    <TextField label="Title / name" placeholder="e.g. Orbit hosting" value={form.title} onChangeText={(value) => change('title', value)} />
    <TextField label="Username / email" placeholder="demo@maivelle.example" value={form.username}
      autoCapitalize="none" autoComplete="off" importantForAutofill="no" onChangeText={(value) => change('username', value)} />
    <DemoPassword />
    <Button label="Generate password" variant="secondary" onPress={() => router.push('/vault/generate-password')} />
    <TextField label="Website (optional)" placeholder="https://orbit.example" value={form.website}
      autoCapitalize="none" keyboardType="url" onChangeText={(value) => change('website', value)} />
    <TextField label="Tag (optional)" placeholder="e.g. work" value={form.tag} autoCapitalize="none" onChangeText={(value) => change('tag', value)} />
    <TextField label="Notes (optional)" placeholder="Fictional sample notes..." value={form.notes} multiline onChangeText={(value) => change('notes', value)} />
    <Button label="Save credential — unavailable" disabled accessibilityHint="Secure saving requires vault protection and encrypted storage, which are not implemented." />
    <AppText variant="caption" tone="secondary">Form values are discarded when you leave. No credential is created or saved.</AppText>
  </Screen>;
}
