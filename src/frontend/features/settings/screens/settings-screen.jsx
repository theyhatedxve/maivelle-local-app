import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, MenuRow, Screen } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { SettingsHeader } from '../components/settings-header';

export default function SettingsScreen() {
  const theme = useAppTheme();
  return <Screen contentClassName="gap-lg" testID="settings-screen">
    <SettingsHeader title="Settings" subtitle="Make Maivelle feel like your space." />
    <AppText variant="caption" tone="primary">Settings preview · Security and backup tools are not available yet</AppText>
    <View className="gap-sm">
      <AppText variant="caption" tone="secondary">APP PREFERENCES</AppText>
      <Card compact>
        <MenuRow icon="color-palette-outline" label="Theme" value={`System · ${theme.isDark ? 'Dark' : 'Light'}`} />
        <MenuRow icon="lock-closed-outline" label="App lock" value="Preview only" onPress={() => router.push('/unlock')} />
        <MenuRow icon="key-outline" label="Vault unlock preview" onPress={() => router.push('/vault-unlock')} />
        <MenuRow icon="sparkles-outline" label="Welcome and setup preview" onPress={() => router.push('/welcome')} />
        <MenuRow icon="cloud-upload-outline" label="Auto backup" value="Unavailable" />
        <MenuRow icon="file-tray-outline" label="Data management" value="Coming next" />
      </Card>
      <AppText variant="caption" tone="secondary">The theme follows your device. Manual theme selection and saved preferences are coming later.</AppText>
    </View>
    <View className="gap-sm">
      <AppText variant="caption" tone="secondary">GENERAL</AppText>
      <Card compact>
        <MenuRow icon="notifications-outline" label="Notifications" value="Unavailable" />
        <MenuRow icon="shield-outline" label="Privacy" onPress={() => router.push('/settings/privacy')} />
        <MenuRow icon="language-outline" label="Language" value="English" />
        <MenuRow icon="information-circle-outline" label="About" onPress={() => router.push('/settings/about')} />
      </Card>
    </View>
  </Screen>;
}
