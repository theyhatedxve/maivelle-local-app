import { router } from 'expo-router';
import { AppText, Card, MenuRow, Screen, ScreenHeader } from '@/frontend/components';

const TOOLS = [
  { label: 'Folders', icon: 'folder-outline' },
  { label: 'Favorites', icon: 'star-outline' },
  { label: 'Activity log', icon: 'time-outline' },
  { label: 'Backup & restore', icon: 'cloud-upload-outline' },
];

export default function MoreScreen() {
  return <Screen edges={['top', 'left', 'right']} contentClassName="gap-lg" testID="more-menu">
    <ScreenHeader title="More" subtitle="Additional tools and settings." />
    <AppText variant="caption" tone="primary">Design preview · Your everyday essentials</AppText>
    <Card compact>
      <MenuRow label="Income tracker" icon="trending-up-outline" onPress={() => router.push('/finance/income')} />
      <MenuRow label="Generate password" icon="key-outline" onPress={() => router.push('/vault/generate-password')} />
      {TOOLS.map((tool) => <MenuRow key={tool.label} {...tool} value="Coming next" />)}
      <MenuRow label="Settings" icon="settings-outline" onPress={() => router.push('/settings')} />
      <MenuRow label="About Maivelle" icon="information-circle-outline" onPress={() => router.push('/settings/about')} />
    </Card>
    <AppText variant="caption" tone="secondary">Upcoming tools will become available as they are built. Favorites are already available inside Notes and the Vault demo.</AppText>
  </Screen>;
}
