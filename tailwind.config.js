const { colors, spacing, radius, typography, lineHeight, fontWeight, fontFamily, layout, opacity } = require('./src/frontend/theme/tokens');
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const palette = (values) => Object.fromEntries(Object.entries(values).map(([key, value]) => [kebab(key), value]));
const pixels = (values) => Object.fromEntries(Object.entries(values).map(([key, value]) => [kebab(key), `${value}px`]));

// Maivelle's tokens replace default color/type/spacing scales; no second palette.
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    colors: { ...palette(colors.light), dark: palette(colors.dark), status: colors.status, brand: colors.brand, transparent: 'transparent' },
    spacing: { ...pixels(spacing), screen: `${layout.screenPadding}px`, 0: '0px' },
    borderRadius: pixels(radius),
    fontSize: Object.fromEntries(Object.entries(typography).map(([key, size]) => [kebab(key), [`${size}px`, { lineHeight: `${lineHeight[key]}px` }]])),
    fontWeight,
    fontFamily: { sans: [fontFamily.webFallback], native: [fontFamily.nativeFallback] },
    minHeight: { touch: `${layout.minimumTouchTarget}px`, multiline: `${layout.minimumTouchTarget * 2}px` },
    minWidth: { touch: `${layout.minimumTouchTarget}px` },
    maxWidth: { content: `${layout.maxContentWidth}px` },
    opacity: { ...opacity, 100: '1' },
  },
  plugins: [],
};
