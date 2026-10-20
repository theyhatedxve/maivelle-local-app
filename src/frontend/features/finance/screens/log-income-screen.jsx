import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, Card, IconButton, Screen, ScreenHeader, SegmentedControl, TextField } from '@/frontend/components';
import { dateKey } from '@/frontend/features/calendar/utils/calendar';
import { INCOME_CATEGORIES } from '../data/income-preview';
import { formatIncome, parseIncomeAmount, validIncomeDate } from '../utils/income';

export default function LogIncomeScreen() {
  const [form, setForm] = useState(() => ({ title: '', amount: '', date: dateKey(new Date()), category: 'Consulting', notes: '' }));
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const minor = parseIncomeAmount(form.amount);
  const amountError = form.amount && (minor === null || minor <= 0) ? 'Enter an amount greater than zero, with up to two decimal places.' : undefined;
  return <Screen keyboardAware contentClassName="gap-lg" testID="log-income-screen">
    <View className="self-start"><IconButton icon="arrow-back" label="Back from Log income" onPress={() => router.canGoBack() ? router.back() : router.replace('/finance/income')} /></View>
    <ScreenHeader title="Log income" subtitle="Explore the form with sample values." />
    <AppText variant="caption" tone="primary">Form preview · Nothing is saved · Values are discarded on exit</AppText>
    <Button label="Fill sample entry" variant="secondary" onPress={() => setForm({ title: 'Consulting project', amount: '54000.00', date: dateKey(new Date()), category: 'Consulting', notes: 'Fictional income for the design preview.' })} />
    <TextField label="Title / source" placeholder="e.g. Consulting project" value={form.title} onChangeText={(value) => change('title', value)} />
    <TextField label="Amount (PHP)" placeholder="0.00" keyboardType="decimal-pad" value={form.amount} maxLength={20}
      onChangeText={(value) => change('amount', value)} error={amountError || undefined} hint="Use a decimal point, without currency symbols or commas." />
    {minor !== null && minor > 0 && <Card compact variant="selected"><AppText accessibilityLiveRegion="polite" tone="primary">Amount preview: {formatIncome(minor)}</AppText></Card>}
    <TextField label="Date (YYYY-MM-DD)" value={form.date} maxLength={10} autoCapitalize="none" onChangeText={(value) => change('date', value)}
      error={!validIncomeDate(form.date) ? 'Enter a valid date, such as 2026-10-18.' : undefined} />
    <SegmentedControl label="Entry category" value={form.category} onChange={(value) => change('category', value)}
      options={INCOME_CATEGORIES.map((value) => ({ value, label: value }))} />
    <TextField label="Notes (optional)" placeholder="Sample notes..." value={form.notes} multiline onChangeText={(value) => change('notes', value)} />
    <Button label="Save income — unavailable" disabled accessibilityHint="Permanent saving will be available when local storage is implemented." />
  </Screen>;
}
