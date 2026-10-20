import { ScrollView, View } from 'react-native';
import { AppText } from '@/frontend/components';
import { useAppTheme } from '@/frontend/theme';
import { formatIncome } from '../utils/income';

export function IncomeBarChart({ buckets }) {
  const theme = useAppTheme();
  const maximum = Math.max(0, ...buckets.map((bucket) => bucket.amountMinor));
  const height = theme.layout.minimumTouchTarget * 3;
  return <View className="gap-sm">
    <AppText variant="caption" tone="secondary">Sample income distribution</AppText>
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View className="flex-row items-end gap-sm">
        {buckets.map((bucket) => <View key={bucket.key} className="items-center gap-sm"
          accessible accessibilityLabel={`${bucket.description ?? bucket.label}: ${formatIncome(bucket.amountMinor)}`}
          style={{ minWidth: theme.layout.minimumTouchTarget }}>
          <View className="justify-end items-center" style={{ height }}>
            <View style={{ width: theme.spacing.xl, height: maximum ? bucket.amountMinor / maximum * height : 0,
              backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm }} />
          </View>
          <AppText variant="caption" tone="secondary">{bucket.label}</AppText>
        </View>)}
      </View>
    </ScrollView>
    <AppText variant="caption" tone="secondary">{buckets[0]?.description ? 'Weeks group days 1–7, 8–14, and so on. Swipe to see every bar.' : 'Monthly totals. Swipe to see every month.'}</AppText>
  </View>;
}
