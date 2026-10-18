import { router } from 'expo-router';
import { View } from 'react-native';
import { IconButton, ScreenHeader } from '@/frontend/components';

export function SettingsHeader({ title, subtitle }) {
  return <View className="gap-lg">
    <View className="self-start"><IconButton icon="arrow-back" label={`Back from ${title}`}
      onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/more')} /></View>
    <ScreenHeader title={title} subtitle={subtitle} />
  </View>;
}
