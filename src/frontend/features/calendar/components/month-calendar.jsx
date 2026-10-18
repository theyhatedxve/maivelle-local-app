import { useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { AppText, Button, IconButton } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { dateKey, monthDays, moveMonth } from '../utils/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthCalendar({ selectedDate, onSelect, events, today }) {
  const theme = useAppTheme();
  const { fontScale } = useWindowDimensions();
  const [availableWidth, setAvailableWidth] = useState(0);
  const gridWidth = Math.max(availableWidth, theme.layout.minimumTouchTarget * Math.max(1, fontScale) * 7);
  const cellHeight = Math.max(theme.layout.minimumTouchTarget, theme.lineHeight.body * fontScale + theme.spacing.xl);
  const markedDays = new Set(events.map((event) => event.date));
  return (
    <View className="gap-sm" onLayout={(event) => setAvailableWidth(event.nativeEvent.layout.width)}>
      <View className="flex-row items-center justify-between gap-sm flex-wrap">
        <AppText variant="cardTitle">{selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</AppText>
        <View className="flex-row items-center gap-xs">
          <IconButton icon="chevron-back" label="Previous month" onPress={() => onSelect(moveMonth(selectedDate, -1))} />
          <Button label="Today" variant="secondary" onPress={() => onSelect(today)} />
          <IconButton icon="chevron-forward" label="Next month" onPress={() => onSelect(moveMonth(selectedDate, 1))} />
        </View>
      </View>
      {availableWidth > 0 && availableWidth < gridWidth && <AppText variant="caption" tone="secondary">Swipe the calendar to see the full week.</AppText>}
      <ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel="Month calendar">
        <View style={{ width: gridWidth }}>
          <View className="flex-row">
            {WEEKDAYS.map((day) => <View key={day} style={{ width: gridWidth / 7 }} className="items-center py-sm">
              <AppText variant="caption" tone="secondary">{day}</AppText>
            </View>)}
          </View>
          <View className="flex-row flex-wrap">
            {monthDays(selectedDate).map(({ date, key, inMonth }) => {
              const selected = key === dateKey(selectedDate);
              const isToday = key === dateKey(today);
              const marked = markedDays.has(key);
              return (
                <Pressable key={key} accessibilityRole="button"
                  accessibilityLabel={`${date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}${isToday ? ', today' : ''}${marked ? ', has sample events' : ''}`}
                  accessibilityState={{ selected }} aria-selected={selected} onPress={() => onSelect(date)}
                  style={{ width: gridWidth / 7, minHeight: cellHeight }}
                  className={['items-center justify-center gap-xs rounded-full', selected ? 'bg-primary dark:bg-dark-primary' : 'active:opacity-pressed'].join(' ')}>
                  <AppText tone={selected ? 'onPrimary' : isToday ? 'primary' : inMonth ? 'default' : 'secondary'}>{date.getDate()}</AppText>
                  {marked && <View style={{ width: theme.spacing.xs, height: theme.spacing.xs, borderRadius: theme.radius.full,
                    backgroundColor: selected ? theme.colors.onPrimary : theme.colors.primary }} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
