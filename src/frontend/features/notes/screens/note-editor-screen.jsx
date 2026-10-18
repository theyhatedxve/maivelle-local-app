import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';
import { AppIcon, AppText, Button, Card, EmptyState, IconButton, Screen, TextField } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { useNotesPreview } from '../stores/notes-preview';
import { formatNoteText } from '../utils/notes';

const TOOLS = [
  { key: 'bold', icon: 'text', label: 'Insert bold Markdown' },
  { key: 'italic', icon: 'pencil-outline', label: 'Insert italic Markdown' },
  { key: 'bullet', icon: 'list-outline', label: 'Insert bullet list' },
  { key: 'numbered', icon: 'list', label: 'Insert numbered list' },
  { key: 'link', icon: 'link-outline', label: 'Insert Markdown link' },
];

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateNote } = useNotesPreview();
  const theme = useAppTheme();
  const note = notes.find((item) => item.id === id);
  const bodyRef = useRef(null);
  const lastSelection = useRef(null);
  const nextItem = useRef(0);
  const [selection, setSelection] = useState(undefined);
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/notes');
  if (!note) return <Screen centered><EmptyState title="Note not found in this preview" description="Reloading clears notes created during a previous session."
    action={{ label: 'Return to Notes', onPress: () => router.replace('/(tabs)/notes') }} /></Screen>;
  const change = (patch) => updateNote(note.id, patch);
  const format = (kind) => {
    // Web focus changes can precede React's selection event; read the host range.
    const input = bodyRef.current;
    const range = Platform.OS === 'web' && typeof input?.selectionStart === 'number'
      ? { start: input.selectionStart, end: input.selectionEnd } : lastSelection.current;
    const result = formatNoteText(note.body, range, kind);
    change({ body: result.text });
    lastSelection.current = result.selection;
    setSelection(result.selection);
    bodyRef.current?.focus();
  };
  return <Screen keyboardAware contentClassName="gap-lg" testID="note-editor">
    <View className="flex-row items-center justify-between gap-sm">
      <IconButton icon="arrow-back" label="Back to Notes" onPress={back} />
      <View className="flex-row gap-sm">
        <IconButton icon={note.pinned ? 'pin' : 'pin-outline'} label={note.pinned ? 'Unpin note' : 'Pin note'} onPress={() => change({ pinned: !note.pinned })} />
        <IconButton icon={note.favorite ? 'star' : 'star-outline'} label={note.favorite ? 'Unfavorite note' : 'Favorite note'} onPress={() => change({ favorite: !note.favorite })} />
      </View>
    </View>
    <AppText variant="caption" tone="primary">Preview editor · Kept in memory only · Resets on reload</AppText>
    <TextField label="Note title" placeholder="Untitled note" value={note.title} onChangeText={(title) => change({ title })}
      multiline style={{ minHeight: theme.layout.minimumTouchTarget }} />
    <View className="flex-row flex-wrap items-center justify-between gap-sm">
      <AppText variant="caption" tone="secondary">Updated {new Date(note.updatedAt).toLocaleString()}</AppText>
      {note.pinned && <AppText variant="caption" tone="primary">Pinned</AppText>}
    </View>
    <TextField label="Tag" placeholder="e.g. personal" value={note.tag}
      autoCapitalize="none" onChangeText={(tag) => change({ tag: tag.replace(/^#+/, '') })} />
    <TextField label="Body (Markdown)" placeholder="Every thought deserves a place..." value={note.body}
      ref={bodyRef} multiline style={{ minHeight: theme.layout.minimumTouchTarget * 4 }}
      selection={selection} onSelectionChange={(event) => { lastSelection.current = event.nativeEvent.selection; }}
      onChangeText={(body) => { setSelection(undefined); change({ body }); }} />
    <View className="flex-row flex-wrap gap-sm" accessibilityLabel="Markdown tools">
      {TOOLS.map((tool) => <IconButton key={tool.key} icon={tool.icon} label={tool.label} onPress={() => format(tool.key)} />)}
    </View>
    <AppText variant="caption" tone="secondary">Formatting tools insert Markdown into plain text. Links are not opened by this preview.</AppText>
    <View className="gap-md">
      <AppText variant="sectionTitle">Checklist</AppText>
      {note.checklist.map((item, index) => <Card compact key={item.id} className="flex-row items-center gap-sm">
        <Pressable accessibilityRole="checkbox" accessibilityLabel={`Toggle checklist item: ${item.text || `Item ${index + 1}`}`}
          accessibilityState={{ checked: item.done }} aria-checked={item.done}
          className="min-h-touch min-w-touch items-center justify-center"
          onPress={() => change({ checklist: note.checklist.map((current) => current.id === item.id ? { ...current, done: !current.done } : current) })}>
          <AppIcon name={item.done ? 'checkbox' : 'square-outline'} />
        </Pressable>
        <TextField label={`Item ${index + 1}`} value={item.text} placeholder="Checklist item" containerClassName="flex-1" multiline
          style={{ minHeight: theme.layout.minimumTouchTarget }}
          onChangeText={(text) => change({ checklist: note.checklist.map((current) => current.id === item.id ? { ...current, text } : current) })} />
        <IconButton icon="close-outline" label={`Remove checklist item ${index + 1}`}
          onPress={() => change({ checklist: note.checklist.filter((current) => current.id !== item.id) })} />
      </Card>)}
      {!note.checklist.length && <AppText tone="secondary">Turn a thought into a small next step.</AppText>}
      <Button label="Add checklist item" variant="secondary" onPress={() => change({ checklist: [...note.checklist,
        { id: `item-${note.id}-${Date.now()}-${++nextItem.current}`, text: '', done: false }] })} />
    </View>
    <Button label="Done — return to Notes" onPress={back} />
    <AppText variant="caption" tone="secondary">Edits update the preview immediately. Nothing is saved to device storage.</AppText>
  </Screen>;
}
