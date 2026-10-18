import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppIcon, AppText, Card, EmptyState, IconButton, SearchField, SegmentedControl } from '@/frontend/components';

const STATUSES = [{ value: 'todo', label: 'To do' }, { value: 'progress', label: 'In progress' }, { value: 'done', label: 'Done' }];

export function TaskPreviewList({ tasks, onToggle }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const normalized = query.trim().toLowerCase();
  const filtered = tasks.filter((task) => task.status === status && (priority === 'All' || task.priority === priority)
    && `${task.title} ${task.tag}`.toLowerCase().includes(normalized));

  return <View className="gap-lg">
    <View className="flex-row items-end gap-sm">
      <View className="flex-1"><SearchField label="Search tasks" placeholder="Search titles or tags..." value={query} onChangeText={setQuery} /></View>
      <IconButton icon="filter-outline" label={showFilters ? 'Hide priority filters' : 'Show priority filters'}
        accessibilityState={{ expanded: showFilters }} onPress={() => setShowFilters(!showFilters)} />
    </View>
    {showFilters && <SegmentedControl label="Task priority" value={priority} onChange={setPriority}
      options={['All', 'High', 'Medium', 'Low'].map((value) => ({ value, label: value }))} />}
    <SegmentedControl label="Task status" value={status} onChange={setStatus}
      options={STATUSES.map((option) => ({ ...option, label: `${option.label} ${tasks.filter((task) => task.status === option.value).length}` }))} />
    <AppText variant="caption" tone="secondary" accessibilityLiveRegion="polite">{filtered.length} sample {filtered.length === 1 ? 'task' : 'tasks'}</AppText>
    {filtered.length ? filtered.map((task) => <Card compact key={task.id} className="gap-sm">
      <View className="flex-row items-center gap-sm">
        <Pressable accessibilityRole="checkbox" accessibilityLabel={`Complete sample task: ${task.title}`}
          accessibilityState={{ checked: task.status === 'done' }} aria-checked={task.status === 'done'} onPress={() => onToggle(task.id)}
          className="min-h-touch min-w-touch items-center justify-center active:opacity-pressed">
          <AppIcon name={task.status === 'done' ? 'checkbox' : 'square-outline'} />
        </Pressable>
        <AppText variant="cardTitle" className={['flex-1', task.status === 'done' ? 'line-through' : ''].join(' ')}>{task.title}</AppText>
      </View>
      <View className="flex-row flex-wrap items-center gap-sm">
        <View className="rounded-sm px-sm py-xs bg-surface-selected dark:bg-dark-surface-selected"><AppText variant="caption" tone="primary">{task.tag}</AppText></View>
        <AppText variant="caption" tone={task.priority === 'High' ? 'error' : 'secondary'}>{task.priority}</AppText>
        <View className="flex-row items-center gap-xs">
          <AppIcon name="calendar-outline" />
          <AppText variant="caption" tone="secondary">{new Date(`${task.due}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</AppText>
        </View>
      </View>
    </Card>) : <EmptyState title="No matching sample tasks" description="Try another search, priority, or status." />}
  </View>;
}
