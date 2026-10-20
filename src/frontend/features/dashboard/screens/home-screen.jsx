import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { AppIcon, AppText, Card, IconButton, Screen, SummaryTile } from '@/frontend/components';
import { BRAND } from '@/frontend/constants/brand';
import { BRAND_ASSETS } from '@/frontend/constants/assets';
import { useAppTheme } from '@/frontend/theme';

import { DASHBOARD_PREVIEW } from '../data/preview';

export default function HomeScreen() {
  const theme = useAppTheme();
  const { width, fontScale } = useWindowDimensions();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const openTab = (route) => router.navigate(`/(tabs)/${route}`);
  const tileWidth = width / fontScale < theme.layout.minimumTouchTarget * 7 ? '100%' : '48%';
  const { summary, tasks } = DASHBOARD_PREVIEW;
  return (
    <Screen edges={['top', 'left', 'right']} contentClassName="gap-lg">
      <View className="flex-row items-center gap-md">
        <Image source={BRAND_ASSETS.appIcon} contentFit="contain" accessible={false}
          style={{ width: theme.layout.minimumTouchTarget, height: theme.layout.minimumTouchTarget }} />
        <View className="flex-1 gap-xs">
          <AppText variant="sectionTitle" tone="primary">{BRAND.name}</AppText>
          <AppText variant="caption" tone="secondary">{BRAND.slogan}</AppText>
        </View>
        <IconButton icon="person" label="Open More and settings preview" onPress={() => openTab('more')} />
      </View>

      <View className="gap-sm">
        <AppText variant="caption" tone="primary">{date}</AppText>
        <View className="flex-row items-center gap-sm">
          <AppText variant="pageTitle" className="shrink">{greeting}</AppText>
          <AppIcon name="sparkles" />
        </View>
        <AppText tone="secondary">Welcome back. Make room for what matters.</AppText>
        <View className="self-start rounded-sm px-sm py-xs bg-surface-selected dark:bg-dark-surface-selected">
          <AppText variant="caption" tone="primary">Design preview · Sample data</AppText>
        </View>
      </View>

      <Card variant="selected" compact className="flex-row items-center gap-md">
        <AppIcon name="server-outline" />
        <View className="flex-1 gap-xs">
          <AppText variant="cardTitle">Your space. Your control.</AppText>
          <AppText variant="caption" tone="primary">Local storage and encrypted backups are coming next.</AppText>
        </View>
      </Card>

      <View className="flex-row flex-wrap justify-between gap-md">
        <SummaryTile label="Vault items" value={summary.vaultItems} icon="lock-closed-outline"
          style={{ width: tileWidth }} onPress={() => openTab('vault')} />
        <SummaryTile label="Notes" value={summary.notes} icon="document-text-outline"
          style={{ width: tileWidth }} onPress={() => openTab('notes')} />
        <SummaryTile label="Open tasks" value={summary.openTasks} icon="checkbox-outline"
          style={{ width: tileWidth }} onPress={() => openTab('plan')} />
        <SummaryTile label="This month's income" value={summary.income} icon="trending-up-outline" tone="success"
          style={{ width: tileWidth }} onPress={() => router.push('/finance/income')} />
      </View>

      <View className="gap-sm">
        <View className="flex-row items-center justify-between gap-sm">
          <AppText variant="sectionTitle" className="shrink">Upcoming tasks</AppText>
          <Pressable accessibilityRole="button" accessibilityLabel="View Plan preview"
            onPress={() => openTab('plan')} className="min-h-touch px-sm items-center justify-center active:opacity-pressed">
            <AppText variant="caption" tone="primary">View all ›</AppText>
          </Pressable>
        </View>
        <Card compact className="gap-lg">
          {tasks.map((task) => (
            <View key={task.id} className="flex-row items-center gap-sm">
              <View accessibilityLabel={`${task.priority} priority`} accessible
                style={{ width: theme.spacing.sm, height: theme.spacing.sm, borderRadius: theme.radius.full,
                  backgroundColor: theme.status[task.status] }} />
              <AppText className="flex-1">{task.title}</AppText>
              <AppText variant="caption" tone="secondary" className="shrink">{task.due}</AppText>
            </View>
          ))}
        </Card>
      </View>
      <AppText variant="caption" tone="secondary">
        Sample totals and tasks are for this preview only. Saving and backups are not available yet.
      </AppText>
    </Screen>
  );
}
