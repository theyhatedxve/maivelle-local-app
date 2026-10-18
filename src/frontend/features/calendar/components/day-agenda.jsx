import { View } from 'react-native';
import { AppText, Card, EmptyState } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { dateKey } from '../utils/calendar';

export function DayAgenda({ date, events, today }) {
  const theme = useAppTheme();
  const items = events.filter((event) => event.date === dateKey(date));
  const title = `${dateKey(date) === dateKey(today) ? 'Today · ' : ''}${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  return <View className="gap-md">
    <AppText variant="sectionTitle">{title}</AppText>
    {items.length ? items.map((event) => <Card key={event.id} compact className="flex-row items-center gap-md">
      <View style={{ width: theme.spacing.xs, alignSelf: 'stretch', borderRadius: theme.radius.full, backgroundColor: theme.status[event.status] }} />
      <View className="flex-1 gap-xs">
        <AppText variant="cardTitle">{event.title}</AppText>
        <AppText variant="caption" tone="secondary">{event.time}</AppText>
      </View>
    </Card>) : <EmptyState title="No sample events" description="Choose a marked day to preview its agenda." />}
  </View>;
}
