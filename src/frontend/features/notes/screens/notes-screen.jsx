import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AppIcon, AppText, Button, Card, EmptyState, IconButton, Screen, ScreenHeader, SearchField, SegmentedControl } from '@/frontend/components';
import { BRAND_COPY } from '@/frontend/constants/brand';
import { useAppTheme } from '@/frontend/theme';
import { useNotesPreview } from '../stores/notes-preview';
import { findNotes } from '../utils/notes';

export default function NotesScreen() {
  const theme = useAppTheme();
  const { notes, updateNote, createNote } = useNotesPreview();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const visible = findNotes(notes, query, filter);
  const openNote = (id) => router.push({ pathname: '/notes/[id]', params: { id } });

  return <Screen edges={['top', 'left', 'right']} contentClassName="gap-lg" testID="notes-list">
    <ScreenHeader title="Notes" subtitle={BRAND_COPY.notes}
      trailing={<IconButton icon="person" label="Open More preview" onPress={() => router.navigate('/(tabs)/more')} />} />
    <AppText variant="caption" tone="primary">Design preview · Sample notes · Changes reset on reload</AppText>
    <View className="flex-row items-end gap-sm">
      <View className="flex-1"><SearchField label="Search notes" placeholder="Search notes or tags..." value={query} onChangeText={setQuery} /></View>
      <IconButton icon="filter-outline" label={showFilters ? 'Hide note filters' : 'Show note filters'}
        accessibilityState={{ expanded: showFilters }} onPress={() => setShowFilters(!showFilters)} />
    </View>
    {showFilters && <SegmentedControl label="Note filter" value={filter} onChange={setFilter}
      options={[{ value: 'all', label: 'All' }, { value: 'favorites', label: 'Favorites' }, { value: 'checklists', label: 'Checklists' }]} />}
    <AppText variant="caption" tone="secondary" accessibilityLiveRegion="polite">{visible.length} preview {visible.length === 1 ? 'note' : 'notes'}{filter !== 'all' ? ` · ${filter}` : ''}</AppText>
    {visible.length ? visible.map((note) => <Card compact key={note.id} className="flex-row items-center gap-sm">
      <Pressable accessibilityRole="button" accessibilityLabel={`Open note: ${note.title || 'Untitled note'}`}
        onPress={() => openNote(note.id)} className="flex-1 min-h-touch flex-row items-center gap-md active:opacity-pressed">
        <View className="p-sm rounded-md bg-surface-selected dark:bg-dark-surface-selected"><AppIcon name="document-text" /></View>
        <View className="flex-1 gap-xs">
          <AppText variant="cardTitle" numberOfLines={2}>{note.title || 'Untitled note'}</AppText>
          <AppText variant="caption" tone="secondary" numberOfLines={2}>{note.body || 'Start a new thought...'}</AppText>
          <AppText variant="caption" tone="primary">{note.pinned ? 'Pinned · ' : ''}{note.tag ? `#${note.tag}` : 'No tag'}{note.checklist.length ? ` · ${note.checklist.filter((item) => item.done).length}/${note.checklist.length} done` : ''}</AppText>
          <AppText variant="caption" tone="secondary">{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</AppText>
        </View>
      </Pressable>
      <IconButton icon={note.favorite ? 'star' : 'star-outline'}
        label={`${note.favorite ? 'Unfavorite' : 'Favorite'} note: ${note.title || 'Untitled note'}`}
        onPress={() => updateNote(note.id, { favorite: !note.favorite })} />
    </Card>) : <EmptyState title="No matching preview notes" description="Try another search or filter." />}
    <Button label="New preview note" onPress={() => openNote(createNote())}
      leading={<AppIcon name="add" color={theme.colors.onPrimary} />} />
    <AppText variant="caption" tone="secondary">Notes live only in this preview session. Device storage is not implemented yet.</AppText>
  </Screen>;
}
