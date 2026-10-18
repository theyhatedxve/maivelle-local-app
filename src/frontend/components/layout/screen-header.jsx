import { View } from 'react-native';
import { AppText } from '../ui/app-text';

export function ScreenHeader({ title, subtitle, trailing }) {
  return (
    <View className="flex-row items-center gap-lg flex-wrap">
      <View className="flex-1 gap-xs">
        <AppText variant="pageTitle">{title}</AppText>
        {subtitle && <AppText tone="secondary">{subtitle}</AppText>}
      </View>
      {trailing}
    </View>
  );
}
