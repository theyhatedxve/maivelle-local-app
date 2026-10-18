import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/frontend/theme';
export default function RootLayout() {
  const theme = useAppTheme();
  return <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.colors.background
      }
    }} />
    </>;
}
