import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { AppText, Card, Screen } from '@/frontend/components';
import { BRAND } from '@/frontend/constants/brand';
import { BRAND_ASSETS } from '@/frontend/constants/assets';
import { useAppTheme } from '@/frontend/theme';
import { SettingsHeader } from '../components/settings-header';

export default function AboutScreen() {
  const theme = useAppTheme();
  return <Screen contentClassName="gap-lg" testID="about-screen">
    <SettingsHeader title="About Maivelle" />
    <Card className="items-center gap-md">
      <Image source={BRAND_ASSETS.appIcon} contentFit="contain" accessible={false}
        style={{ width: theme.layout.minimumTouchTarget * 2, height: theme.layout.minimumTouchTarget * 2 }} />
      <AppText variant="pageTitle" tone="primary">{BRAND.name}</AppText>
      <AppText className="text-center">{BRAND.slogan}</AppText>
      <AppText variant="caption" tone="secondary">Version {Constants.expoConfig?.version ?? 'development preview'}</AppText>
    </Card>
    <Card className="gap-sm">
      <AppText variant="sectionTitle">Your everyday space</AppText>
      <AppText tone="secondary">Plans, notes, and important details, brought together in one calm place.</AppText>
      <AppText tone="secondary">Maivelle is being built as a personal, local, offline-first app.</AppText>
    </Card>
    <AppText variant="caption" tone="primary">Development preview · Sample data and temporary edits only</AppText>
  </Screen>;
}
