import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppIcon, AppText, Button, Card, EmptyState, IconButton, Screen, ScreenHeader, SegmentedControl } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { createIncomePreview, INCOME_CATEGORIES } from '../data/income-preview';
import { formatIncome, incomeBuckets, selectIncome, totalIncome } from '../utils/income';
import { IncomeBarChart } from '../components/income-bar-chart';

export default function IncomeScreen() {
  const theme = useAppTheme();
  const [today] = useState(() => new Date());
  const [entries] = useState(() => createIncomePreview(today));
  const [mode, setMode] = useState('month');
  const [category, setCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const visible = selectIncome(entries, { today, allTime: mode === 'all', category });
  const buckets = incomeBuckets(visible, today, mode === 'all');
  const period = mode === 'all' ? 'All-time sample income' : today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const changeMode = (value) => { setMode(value); setCategory('all'); setShowAll(false); };
  return <Screen contentClassName="gap-lg" testID="income-screen">
    <View className="self-start"><IconButton icon="arrow-back" label="Back from Income" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/more')} /></View>
    <ScreenHeader title="Income" subtitle="Track and manage your income."
      trailing={<Button label="Log income" onPress={() => router.push('/finance/log-income')}
        leading={<AppIcon name="add" color={theme.colors.onPrimary} />} />} />
    <AppText variant="caption" tone="primary">Design preview · Fictional PHP entries · Saving is not available</AppText>
    <SegmentedControl label="Income view" value={mode} onChange={changeMode}
      options={[{ value: 'month', label: 'This Month' }, { value: 'all', label: 'All Time' }, { value: 'categories', label: 'Categories' }]} />
    {mode === 'categories' && <SegmentedControl label="Income category" value={category} onChange={(value) => { setCategory(value); setShowAll(false); }}
      options={[{ value: 'all', label: 'All categories' }, ...INCOME_CATEGORIES.map((value) => ({ value, label: value }))]} />}
    <Card className="gap-lg">
      <AppText variant="caption" tone="secondary">{period}</AppText>
      <View className="flex-row flex-wrap justify-between gap-lg">
        <View className="gap-xs"><AppText variant="caption" tone="secondary">Total sample income</AppText>
          <AppText variant="pageTitle" tone="success" testID="income-total">{formatIncome(totalIncome(visible))}</AppText></View>
        <View className="gap-xs"><AppText variant="caption" tone="secondary">Entries</AppText>
          <AppText variant="pageTitle" testID="income-count">{visible.length}</AppText></View>
      </View>
      <IncomeBarChart buckets={buckets} />
    </Card>
    {mode === 'categories' && <View className="gap-sm">
      <AppText variant="sectionTitle">Income by category</AppText>
      {INCOME_CATEGORIES.filter((item) => category === 'all' || category === item).map((item) => {
        const group = visible.filter((entry) => entry.category === item);
        return <Card compact key={item} className="flex-row flex-wrap justify-between gap-sm">
          <AppText>{item} · {group.length} {group.length === 1 ? 'entry' : 'entries'}</AppText>
          <AppText tone="success">{formatIncome(totalIncome(group))}</AppText>
        </Card>;
      })}
    </View>}
    <View className="flex-row items-center justify-between gap-sm flex-wrap">
      <AppText variant="sectionTitle">{showAll ? 'All sample entries' : 'Recent entries'}</AppText>
      {visible.length > 3 && <Button label={showAll ? 'Show recent' : 'View all'} variant="secondary" onPress={() => setShowAll(!showAll)} />}
    </View>
    {visible.length ? (showAll ? visible : visible.slice(0, 3)).map((entry) => <Card compact key={entry.id} className="gap-sm">
      <AppText variant="cardTitle">{entry.title}</AppText>
      <View className="flex-row flex-wrap justify-between gap-sm">
        <View className="gap-xs"><AppText variant="caption" tone="secondary">{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</AppText>
          <AppText variant="caption" tone="primary">{entry.category}</AppText></View>
        <AppText variant="cardTitle" tone="success">+{formatIncome(entry.amountMinor)}</AppText>
      </View>
    </Card>) : <EmptyState title="No sample income" description="Choose another category or time period." />}
  </Screen>;
}
