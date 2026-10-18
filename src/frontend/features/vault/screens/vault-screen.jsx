import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AppIcon, AppText, Button, Card, EmptyState, IconButton, Screen, ScreenHeader, SearchField, SegmentedControl } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { VaultPreviewNotice } from '../components/vault-preview-notice';
import { useVaultPreview } from '../stores/vault-preview';
import { filterCredentials } from '../utils/filter-credentials';

export default function VaultScreen() {
  const theme = useAppTheme();
  const { records, toggleFavorite } = useVaultPreview();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const tags = [...new Set(records.map((record) => record.tag))];
  const visible = filterCredentials(records, query, tag, favoritesOnly);
  return <Screen edges={['top', 'left', 'right']} contentClassName="gap-lg" testID="vault-list">
    <ScreenHeader title="My Vault" subtitle="A preview of your credential space."
      trailing={<IconButton icon="person" label="Open More preview" onPress={() => router.navigate('/(tabs)/more')} />} />
    <VaultPreviewNotice />
    <View className="flex-row items-end gap-sm">
      <View className="flex-1"><SearchField label="Search demo credentials" placeholder="Search names or tags..." value={query} onChangeText={setQuery} /></View>
      <IconButton icon="filter-outline" label={showTags ? 'Hide vault tags' : 'Show vault tags'} accessibilityState={{ expanded: showTags }} onPress={() => setShowTags(!showTags)} />
    </View>
    {showTags && <SegmentedControl label="Credential tag" value={tag} onChange={setTag}
      options={[{ value: 'all', label: 'All tags' }, ...tags.map((value) => ({ value, label: `#${value}` }))]} />}
    <SegmentedControl label="Credential view" value={favoritesOnly ? 'favorites' : 'all'} onChange={(value) => setFavoritesOnly(value === 'favorites')}
      options={[{ value: 'all', label: 'All credentials' }, { value: 'favorites', label: 'Favorites' }]} />
    <AppText variant="caption" tone="secondary" accessibilityLiveRegion="polite">{visible.length} demo {visible.length === 1 ? 'credential' : 'credentials'}</AppText>
    {visible.length ? visible.map((record) => <Card compact key={record.id} className="flex-row items-center gap-sm">
      <Pressable className="flex-1 min-h-touch flex-row items-center gap-md active:opacity-pressed"
        accessibilityRole="button" accessibilityLabel={`Open demo credential: ${record.title}`}
        onPress={() => router.push({ pathname: '/vault/[id]', params: { id: record.id } })}>
        <View className="p-sm rounded-md bg-surface-selected dark:bg-dark-surface-selected"><AppIcon name={record.icon} /></View>
        <View className="flex-1 gap-xs">
          <AppText variant="cardTitle">{record.title}</AppText>
          <AppText variant="caption" tone="secondary" numberOfLines={1}>{record.username}</AppText>
          <AppText variant="caption" tone="primary">#{record.tag}</AppText>
        </View>
      </Pressable>
      <IconButton icon={record.favorite ? 'star' : 'star-outline'} label={`${record.favorite ? 'Unfavorite' : 'Favorite'} credential: ${record.title}`} onPress={() => toggleFavorite(record.id)} />
    </Card>) : <EmptyState title="No matching demo credentials" description="Try another search, tag, or favorite filter." />}
    <Button label="Preview add credential" onPress={() => router.push('/vault/new')}
      leading={<AppIcon name="add" color={theme.colors.onPrimary} />} />
    <AppText variant="caption" tone="secondary">Favorites reset on reload. No real accounts, passwords, or private records are stored.</AppText>
  </Screen>;
}
