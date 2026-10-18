import { Pressable } from 'react-native';
import { AppIcon } from './app-icon';

export function IconButton({ icon, label, onPress, disabled = false, accessibilityState, ...props }) {
  return (
    <Pressable {...props} accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ ...accessibilityState, disabled }} aria-expanded={accessibilityState?.expanded}
      aria-disabled={disabled} disabled={disabled}
      onPress={disabled ? undefined : onPress}
      className={['min-h-touch min-w-touch rounded-full items-center justify-center bg-surface-selected dark:bg-dark-surface-selected',
        disabled ? 'opacity-disabled' : 'active:opacity-pressed'].join(' ')}>
      <AppIcon name={icon} />
    </Pressable>
  );
}
