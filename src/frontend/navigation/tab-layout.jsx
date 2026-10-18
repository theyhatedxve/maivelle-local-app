import { Tabs } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAIN_TABS } from '@/frontend/constants/navigation';
import { useAppTheme } from '@/frontend/theme';
import { AppIcon } from '@/frontend/components/ui/app-icon';

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const contentHeight = Math.max(theme.layout.minimumTouchTarget,
    theme.layout.iconSize + theme.lineHeight.caption * fontScale + theme.spacing.lg);

  return (
    <Tabs initialRouteName="index" backBehavior="history" screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarLabelPosition: 'below-icon',
      tabBarLabelStyle: {
        fontSize: theme.typography.caption,
        lineHeight: theme.lineHeight.caption,
        fontWeight: theme.fontWeight.semibold,
        marginStart: 0,
        marginEnd: 0,
      },
      tabBarItemStyle: { minHeight: contentHeight },
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        height: contentHeight + insets.bottom,
      },
      sceneStyle: { backgroundColor: theme.colors.background },
    }}>
      {MAIN_TABS.map(({ key, route, label, icon, activeIcon }) => (
        <Tabs.Screen key={key} name={route} options={{
          title: label,
          tabBarIcon: ({ focused, color }) => <AppIcon name={focused ? activeIcon : icon} color={color} />,
          tabBarAccessibilityLabel: label,
          tabBarButtonTestID: `tab-${key}`,
        }} />
      ))}
    </Tabs>
  );
}
