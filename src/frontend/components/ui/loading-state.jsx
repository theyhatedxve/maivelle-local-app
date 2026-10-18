import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '@/frontend/theme';
import { AppText } from './app-text';

export function LoadingState({ label = 'Loading…' }) {
  const theme = useAppTheme();
  return (
    <View accessible accessibilityLabel={label} accessibilityRole="progressbar"
      accessibilityState={{ busy: true }} aria-busy accessibilityLiveRegion="polite"
      className="min-h-touch p-xl gap-md items-center">
      <ActivityIndicator color={theme.colors.primary} accessible={false} aria-hidden />
      <AppText tone="secondary" accessible={false} aria-hidden className="text-center">{label}</AppText>
    </View>
  );
}
