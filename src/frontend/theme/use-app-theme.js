import { useColorScheme } from '@/frontend/hooks/use-color-scheme';
import { colors, fontFamily, fontWeight, layout, lineHeight, motion, opacity, radius, spacing, typography } from './tokens';
export function useAppTheme() {
  const isDark = useColorScheme() === 'dark';
  return {
    colors: isDark ? colors.dark : colors.light,
    status: colors.status,
    spacing,
    radius,
    typography,
    lineHeight,
    fontWeight,
    fontFamily,
    layout,
    motion,
    opacity,
    isDark
  };
}
