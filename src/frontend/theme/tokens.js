/** Brand Identity v1.0, pages 2–4 and 7. The only runtime design-token source. */
const brand = {
  primary: '#6D42B5',
  deepPlum: '#2D1B4E',
  lavender: '#A78BFA',
  lightLavender: '#EDE5FF',
  ivory: '#F8F5FF',
  white: '#FFFFFF'
};
const colors = {
  brand,
  light: {
    background: brand.ivory,
    surface: brand.white,
    surfaceRaised: brand.white,
    surfaceSelected: brand.lightLavender,
    surfaceMuted: '#F6F1FD',
    successText: '#176D4A',
    text: brand.deepPlum,
    textSecondary: '#756A86',
    primary: brand.primary,
    onPrimary: brand.white,
    accent: brand.lavender,
    border: '#DDD5E9',
    errorText: '#B52B37'
  },
  dark: {
    background: '#171122',
    surface: '#292037',
    surfaceRaised: '#352A47',
    surfaceSelected: '#352A47',
    surfaceMuted: '#30263F',
    successText: '#8ADAB7',
    text: '#F7F2FF',
    textSecondary: '#C3B7D5',
    primary: brand.lavender,
    onPrimary: '#211335',
    accent: '#C4A7FF',
    border: '#473A5C',
    errorText: '#FFADB4'
  },
  status: {
    success: '#21865C',
    warning: '#C78519',
    error: '#D64550'
  }
};
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};
const radius = {
  sm: 8,
  md: 12,
  button: 14,
  lg: 16,
  xl: 20,
  modal: 24,
  full: 999
};
const typography = {
  display: 32,
  pageTitle: 26,
  sectionTitle: 20,
  cardTitle: 16,
  body: 14,
  bodyLarge: 16,
  button: 15,
  caption: 12
};
const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700'
};
// Brand fonts are specified, not installed. Never claim a custom font is loaded.
const fontFamily = {
  heading: 'Plus Jakarta Sans',
  body: 'Inter',
  nativeFallback: 'normal',
  webFallback: 'system-ui'
};
const layout = {
  screenPadding: 20,
  minimumTouchTarget: 48,
  maxContentWidth: 800,
  iconSize: 24,
  iconStrokeWidth: 2
};
const motion = {
  fast: 150,
  normal: 200,
  slow: 250
};
const opacity = {
  disabled: 0.5,
  pressed: 0.85
};
const lineHeight = {
  display: 40,
  pageTitle: 34,
  sectionTitle: 28,
  cardTitle: 24,
  body: 22,
  bodyLarge: 24,
  button: 22,
  caption: 18
};

module.exports = { colors, spacing, radius, typography, fontWeight, fontFamily, layout, motion, opacity, lineHeight };
