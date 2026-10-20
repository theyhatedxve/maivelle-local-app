import { AppText, Card, Screen } from '@/frontend/components';
import { SettingsHeader } from '../components/settings-header';

export default function PrivacyScreen() {
  return <Screen contentClassName="gap-lg" testID="privacy-screen">
    <SettingsHeader title="Privacy" subtitle="Your space. Your control." />
    <Card className="gap-md">
      <AppText variant="sectionTitle">What this preview does</AppText>
      <AppText>Notes and task changes stay in memory and reset when the app reloads.</AppText>
      <AppText>Vault entries are fictional. Secure saving, vault unlocking, and app lock are not available.</AppText>
      <AppText>Setup and unlock screens use public demo values only. Generated passwords use device randomness, remain in memory, and clear when you leave the generator or background the app.</AppText>
      <AppText>No backup or restore operation is available yet.</AppText>
    </Card>
    <Card className="gap-md">
      <AppText variant="sectionTitle">Built for personal use</AppText>
      <AppText tone="secondary">The finished app is planned for one owner, with local data and offline access.</AppText>
      <AppText tone="secondary">Cloud synchronization, analytics, advertising, and sharing features are not built into this preview.</AppText>
    </Card>
  </Screen>;
}
