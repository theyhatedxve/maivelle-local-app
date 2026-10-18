import { useState } from 'react';
import { router } from 'expo-router';
import { AppIcon, AppText, Button, IconButton, Screen, ScreenHeader, SegmentedControl } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { MonthCalendar } from '@/frontend/features/calendar/components/month-calendar';
import { DayAgenda } from '@/frontend/features/calendar/components/day-agenda';
import { TaskPreviewList } from '@/frontend/features/tasks/components/task-preview-list';
import { createPlanPreview } from '../data/preview';

export default function PlanScreen() {
  const theme = useAppTheme();
  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState('calendar');
  const [preview] = useState(() => createPlanPreview(today));
  const [tasks, setTasks] = useState(preview.tasks);
  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id !== id ? task
    : { ...task, status: task.status === 'done' ? task.previousStatus ?? 'todo' : 'done', previousStatus: task.status === 'done' ? task.previousStatus : task.status }));

  return <Screen edges={['top', 'left', 'right']} contentClassName="gap-lg">
    <ScreenHeader title={view === 'calendar' ? 'Plan' : 'Tasks'} subtitle="Your schedule and tasks in one place."
      trailing={<IconButton icon="person" label="Open More preview" onPress={() => router.navigate('/(tabs)/more')} />} />
    <AppText variant="caption" tone="primary">Design preview · Sample data · Changes reset when the app reloads</AppText>
    <SegmentedControl label="Plan view" value={view} onChange={setView}
      options={[{ value: 'calendar', label: 'Calendar' }, { value: 'tasks', label: 'Tasks' }]} />
    {view === 'calendar' ? <>
      <MonthCalendar selectedDate={selectedDate} onSelect={setSelectedDate} events={preview.events} today={today} />
      <DayAgenda date={selectedDate} events={preview.events} today={today} />
    </> : <TaskPreviewList tasks={tasks} onToggle={toggleTask} />}
    <Button label={view === 'calendar' ? 'New event' : 'New task'} disabled
      accessibilityHint="Adding records will be available after local storage is implemented."
      leading={<AppIcon name="add" color={theme.colors.onPrimary} />} />
    <AppText variant="caption" tone="secondary">Add and edit tools will be available after local storage is ready.</AppText>
  </Screen>;
}
