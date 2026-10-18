import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { AppIcon, AppText, Card, EmptyState, IconButton, Screen } from '@/frontend/components';
import { VaultPreviewNotice } from '../components/vault-preview-notice';
import { DemoPassword } from '../components/demo-password';
import { useVaultPreview } from '../stores/vault-preview';

export default function CredentialDetailScreen() {
  const { id } = useLocalSearchParams();
  const { records, toggleFavorite } = useVaultPreview();
  const record = records.find((item) => item.id === id);
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/vault');
  if (!record) return <Screen centered><EmptyState title="Demo credential not found" description="This preview contains fictional sample records only."
    action={{ label: 'Return to Vault', onPress: () => router.replace('/(tabs)/vault') }} /></Screen>;
  return <Screen contentClassName="gap-lg" testID="credential-detail">
    <View className="flex-row justify-between gap-sm">
      <IconButton icon="arrow-back" label="Back to Vault" onPress={back} />
      <View className="flex-row gap-sm">
        <IconButton icon="pencil-outline" label="Preview credential form" onPress={() => router.push({ pathname: '/vault/new', params: { sample: record.id } })} />
        <IconButton icon={record.favorite ? 'star' : 'star-outline'} label={record.favorite ? 'Unfavorite demo credential' : 'Favorite demo credential'} onPress={() => toggleFavorite(record.id)} />
      </View>
    </View>
    <View className="items-center gap-sm">
      <View className="p-lg rounded-xl bg-surface-selected dark:bg-dark-surface-selected"><AppIcon name={record.icon} /></View>
      <AppText variant="pageTitle" className="text-center">{record.title}</AppText>
      <AppText tone="secondary">{record.username}</AppText>
      <AppText variant="caption" tone="primary">#{record.tag}</AppText>
    </View>
    <VaultPreviewNotice />
    <Card compact className="gap-xs">
      <AppText variant="caption" tone="secondary">Username / email</AppText>
      <View className="flex-row items-center gap-sm">
        <AppText className="flex-1">{record.username}</AppText>
        <IconButton icon="copy-outline" label="Copy demo username unavailable" disabled />
      </View>
    </Card>
    <DemoPassword />
    <Card compact className="gap-xs">
      <AppText variant="caption" tone="secondary">Website</AppText>
      <AppText tone="primary">{record.website}</AppText>
    </Card>
    <Card compact className="gap-sm">
      <AppText variant="caption" tone="secondary">Notes</AppText>
      <AppText>{record.notes}</AppText>
    </Card>
    <AppText variant="caption" tone="secondary">Clipboard copying and opening websites are not part of this preview.</AppText>
  </Screen>;
}
