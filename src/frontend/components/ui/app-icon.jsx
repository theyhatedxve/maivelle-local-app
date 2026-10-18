import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/frontend/theme';

/** Decorative icons. The containing control owns its accessible name. */
export function AppIcon({ name, size, color }) {
  const theme = useAppTheme();
  return <Ionicons name={name} size={size ?? theme.layout.iconSize}
    color={color ?? theme.colors.primary} accessible={false} aria-hidden />;
}
