import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/frontend/theme';
import { NotesPreviewProvider } from '@/frontend/features/notes/stores/notes-preview';
import { VaultPreviewProvider } from '@/frontend/features/vault/stores/vault-preview';

export default function RootLayout() {
  const theme = useAppTheme();
  return (
    <NotesPreviewProvider>
      <VaultPreviewProvider>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notes/[id]" options={{ title: 'Note editor' }} />
          <Stack.Screen name="vault/new" options={{ title: 'Credential form preview' }} />
          <Stack.Screen name="vault/[id]" options={{ title: 'Demo credential' }} />
          <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
          <Stack.Screen name="settings/about" options={{ title: 'About Maivelle' }} />
          <Stack.Screen name="settings/privacy" options={{ title: 'Privacy' }} />
        </Stack>
      </VaultPreviewProvider>
    </NotesPreviewProvider>
  );
}
