import { router } from 'expo-router';
import { AppText, Card, MenuRow, Screen, ScreenHeader } from '@/frontend/components';

const TOOLS = [
  { label: 'Income tracker', icon: 'trending-up-outline' },
  { label: 'Generate password', icon: 'key-outline' },
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
      {TOOLS.map((tool) => <MenuRow key={tool.label} {...tool} value="Coming next" />)}
      <MenuRow label="Settings" icon="settings-outline" onPress={() => router.push('/settings')} />
      <MenuRow label="About Maivelle" icon="information-circle-outline" onPress={() => router.push('/settings/about')} />
    </Card>
    <AppText variant="caption" tone="secondary">Upcoming tools will become available as they are built. Favorites are already available inside Notes and the Vault demo.</AppText>
  </Screen>;
}
