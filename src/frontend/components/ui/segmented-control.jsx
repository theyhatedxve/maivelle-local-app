import { Pressable, View } from 'react-native';
import { AppText } from './app-text';

export function SegmentedControl({ label, options, value, onChange }) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label}
      className="flex-row flex-wrap gap-xs p-xs rounded-button bg-surface-muted dark:bg-dark-surface-muted">
      {options.map((option) => (
        <Pressable key={option.value} accessibilityRole="tab"
          accessibilityLabel={option.label} accessibilityState={{ selected: value === option.value }}
          aria-selected={value === option.value}
          onPress={() => onChange(option.value)}
          className={['grow min-h-touch min-w-touch px-md py-sm rounded-md items-center justify-center',
            value === option.value ? 'bg-surface-selected dark:bg-dark-surface-selected' : 'active:opacity-pressed'].join(' ')}>
          <AppText variant="caption" tone={value === option.value ? 'primary' : 'secondary'}>{option.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}
