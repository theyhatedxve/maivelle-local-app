import { Pressable, View } from 'react-native';
import { AppText } from './app-text';
import { AppIcon } from './app-icon';
import { Card } from './card';

export function SummaryTile({ label, value, icon, onPress, tone = 'default', style }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. Open preview.`}
      className="active:opacity-pressed" style={style}>
      <Card compact className="gap-md flex-1">
        <View className="flex-row items-center gap-sm">
          <View className="p-sm rounded-sm bg-surface-selected dark:bg-dark-surface-selected">
            <AppIcon name={icon} />
          </View>
          <AppText variant="caption" className="flex-1">{label}</AppText>
        </View>
        <View className="flex-row items-center justify-between gap-xs">
          <AppText variant="sectionTitle" tone={tone} accessibilityRole="text" className="shrink">{value}</AppText>
          <AppIcon name="chevron-forward" />
        </View>
      </Card>
    </Pressable>
  );
}
