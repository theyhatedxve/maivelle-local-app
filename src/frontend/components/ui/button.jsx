import { ActivityIndicator, Pressable } from 'react-native';
import { useAppTheme } from '@/frontend/theme';
import { AppText } from './app-text';

const backgrounds = {
  primary: 'bg-primary dark:bg-dark-primary',
  secondary: 'bg-surface-selected dark:bg-dark-surface-selected',
  danger: 'bg-error-text dark:bg-dark-error-text',
};

export function Button({
  label, onPress, variant = 'primary', loading = false, disabled = false,
  className = '', style, accessibilityLabel, accessibilityState, ...props
}) {
  const theme = useAppTheme();
  const unavailable = disabled || loading;
  const color = variant === 'secondary' ? theme.colors.primary : theme.colors.onPrimary;
  return (
    <Pressable {...props}
      accessible accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ ...accessibilityState, disabled: unavailable, busy: loading }}
      aria-disabled={unavailable} aria-busy={loading}
      disabled={unavailable} onPress={unavailable ? undefined : onPress}
      className={['min-h-touch min-w-touch px-screen py-md rounded-button flex-row items-center justify-center gap-sm', backgrounds[variant] ?? backgrounds.primary, disabled ? 'opacity-disabled' : 'active:opacity-pressed', className].join(' ')}
      style={style}>
      {loading && <ActivityIndicator color={color} accessible={false} aria-hidden />}
      <AppText variant="button" tone={variant === 'secondary' ? 'primary' : 'onPrimary'} className="shrink text-center">{label}</AppText>
    </Pressable>
  );
}
