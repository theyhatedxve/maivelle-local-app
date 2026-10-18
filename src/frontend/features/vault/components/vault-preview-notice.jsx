import { View } from 'react-native';
import { AppIcon, AppText, Card } from '@/frontend/components';

export function VaultPreviewNotice() {
  return <Card compact variant="selected" className="flex-row items-center gap-md">
    <AppIcon name="flask-outline" />
    <View className="flex-1 gap-xs">
      <AppText variant="cardTitle">Vault design preview</AppText>
      <AppText variant="caption" tone="primary">Fictional data only. Vault protection and secure saving are not available.</AppText>
    </View>
  </Card>;
}
