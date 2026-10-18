import { Platform, Text } from 'react-native';

const variants = {
  display: 'text-display font-bold',
  pageTitle: 'text-page-title font-bold',
  sectionTitle: 'text-section-title font-semibold',
  cardTitle: 'text-card-title font-semibold',
  body: 'text-body font-regular',
  bodyLarge: 'text-body-large font-regular',
  button: 'text-button font-semibold',
  caption: 'text-caption font-medium',
};
const tones = {
  default: 'text-text dark:text-dark-text',
  secondary: 'text-text-secondary dark:text-dark-text-secondary',
  primary: 'text-primary dark:text-dark-primary',
  error: 'text-error-text dark:text-dark-error-text',
  onPrimary: 'text-on-primary dark:text-dark-on-primary',
};

export function AppText({ variant = 'body', tone = 'default', className = '', style, accessibilityRole, ...props }) {
  const heading = ['display', 'pageTitle', 'sectionTitle', 'cardTitle'].includes(variant);
  return (
    <Text {...props}
      accessibilityRole={accessibilityRole ?? (heading ? 'header' : undefined)}
      className={[variants[variant] ?? variants.body, tones[tone] ?? tones.default, Platform.OS === 'web' ? 'font-sans' : 'font-native', className].join(' ')}
      style={style}
    />
  );
}
