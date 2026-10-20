import { Image, View } from 'react-native';
import { router } from 'expo-router';
import { AppText, Button, Card, Screen } from '@/frontend/components';
import { BRAND_ASSETS } from '@/frontend/constants/assets';
import { BRAND } from '@/frontend/constants/brand';
import { useAppTheme } from '@/frontend/theme';
import { usePhaseOnePreview } from '../stores/phase-one-preview';

export default function WelcomeScreen() {
  const theme = useAppTheme();
  const { enterPreview } = usePhaseOnePreview();
  return <Screen centered testID="welcome-screen">
    <View className="items-center gap-xl">
      <Image source={theme.isDark ? BRAND_ASSETS.appIcon : BRAND_ASSETS.logo} accessibilityLabel="Maivelle logo" resizeMode="contain" style={{ width: '100%', height: theme.spacing.xxl * 5 }} />
      {theme.isDark && <AppText variant="display">{BRAND.name}</AppText>}
      <AppText variant="sectionTitle" className="text-center">{BRAND.slogan}</AppText>
      <AppText tone="secondary" className="text-center">Designed for a more meaningful everyday.</AppText>
    </View>
    <Card compact><AppText variant="caption" tone="secondary">Phase 1 preview. Setup and unlock screens demonstrate the flow; protection and encrypted storage come in Phase 3. Use public demo values only.</AppText></Card>
    <Button label="Get started" onPress={() => router.push('/setup')} />
    <Button label="Explore app preview" variant="secondary" onPress={() => { enterPreview(); router.replace('/(tabs)'); }} />
    <AppText variant="caption" tone="secondary">PRIVATE · PERSONAL · LOCAL</AppText>
  </Screen>;
}
