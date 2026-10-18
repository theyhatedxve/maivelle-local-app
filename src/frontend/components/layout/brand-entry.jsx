import { Image } from 'expo-image';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import { BRAND_ASSETS } from '@/frontend/constants/assets';
import { BRAND } from '@/frontend/constants/brand';
import { AppText, Screen } from '@/frontend/components';

cssInterop(Image, { className: 'style' });

/** Minimal runnable entry while the approved feature screens are built. */
export function BrandEntry() {
  return (
    <Screen centered>
      <View className="w-full gap-xl">
        <Image source={BRAND_ASSETS.logo} className="w-full aspect-[1443/1080]"
          contentFit="contain" accessible accessibilityLabel={BRAND.name} />
        <AppText variant="bodyLarge" className="text-center">{BRAND.slogan}</AppText>
      </View>
    </Screen>
  );
}
