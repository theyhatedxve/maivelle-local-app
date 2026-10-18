import { Pressable, View } from 'react-native';
import { AppIcon } from './app-icon';
import { AppText } from './app-text';

/** A navigation row, or a read-only setting when no action is supplied. */
export function MenuRow({ icon, label, value, onPress, description }) {
  const Container = onPress ? Pressable : View;
  return <Container onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}
    accessibilityLabel={onPress ? label : undefined}
    className={['min-h-touch flex-row items-center gap-md py-sm', onPress ? 'active:opacity-pressed' : ''].join(' ')}>
    <View className="p-sm rounded-md bg-surface-selected dark:bg-dark-surface-selected"><AppIcon name={icon} /></View>
    <View className="flex-1 gap-xs">
      <AppText>{label}</AppText>
      {description && <AppText variant="caption" tone="secondary">{description}</AppText>}
    </View>
    {value && <AppText variant="caption" tone="secondary" className="shrink">{value}</AppText>}
    {onPress && <AppIcon name="chevron-forward" />}
  </Container>;
}
