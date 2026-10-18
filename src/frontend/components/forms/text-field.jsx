import { useId, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { useAppTheme } from '@/frontend/theme';
import { AppText } from '../ui/app-text';

export function TextField({
  label, hint, error, containerStyle, containerClassName = '', className = '', style,
  ref, editable = true, nativeID, onFocus, onBlur, accessibilityLabel, accessibilityHint,
  accessibilityState, secureTextEntry, autoComplete, importantForAutofill,
  autoCorrect, spellCheck, multiline, ...props
}) {
  const theme = useAppTheme();
  const generatedId = useId();
  const inputId = nativeID ?? 'field-' + generatedId;
  const labelId = inputId + '-label';
  const [focused, setFocused] = useState(false);
  const message = error || hint;
  const border = error ? 'border-status-error'
    : focused ? 'border-primary dark:border-dark-primary' : 'border-border dark:border-dark-border';
  return (
    <View className={['gap-sm', containerClassName].join(' ')} style={containerStyle}>
      <AppText variant="caption" nativeID={labelId}>{label}</AppText>
      <TextInput {...props} ref={ref} nativeID={inputId}
        aria-labelledby={accessibilityLabel ? undefined : labelId}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={[message, accessibilityHint].filter(Boolean).join('. ') || undefined}
        accessibilityState={{ ...accessibilityState, disabled: !editable }}
        aria-disabled={!editable} editable={editable} multiline={multiline}
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete ?? (secureTextEntry ? 'off' : undefined)}
        importantForAutofill={importantForAutofill ?? (secureTextEntry ? 'no' : undefined)}
        autoCorrect={secureTextEntry ? false : autoCorrect}
        spellCheck={secureTextEntry ? false : spellCheck}
        placeholderTextColor={theme.colors.textSecondary} selectionColor={theme.colors.primary}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        className={['rounded-md border px-lg py-md text-body-large bg-surface dark:bg-dark-surface text-text dark:text-dark-text', border, multiline ? 'min-h-multiline align-top' : 'min-h-touch', editable ? 'opacity-100' : 'opacity-disabled', Platform.OS === 'web' ? 'font-sans' : 'font-native', className].join(' ')}
        style={style}
      />
      {message && <AppText variant="caption" tone={error ? 'error' : 'secondary'}
        accessibilityRole={error ? 'alert' : undefined}
        accessibilityLiveRegion="polite">{message}</AppText>}
    </View>
  );
}
