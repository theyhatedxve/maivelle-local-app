import { View } from 'react-native';
import { AppText } from './app-text';
import { Button } from './button';

/** Internal presentation shared by empty/error states; no data fetching. */
export function StateMessage({ title, description, action, error = false }) {
  return (
    <View className="p-xl gap-md items-stretch">
      <AppText variant="cardTitle" tone={error ? 'error' : 'default'}
        accessibilityRole={error ? 'alert' : 'header'}
        accessibilityLiveRegion={error ? 'polite' : undefined}
        className="text-center">{title}</AppText>
      {description && <AppText tone="secondary" className="text-center">{description}</AppText>}
      {action && <Button {...action} variant="secondary" />}
    </View>
  );
}
