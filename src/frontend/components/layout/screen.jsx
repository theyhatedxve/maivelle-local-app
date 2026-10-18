import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({
  children, scroll = true, centered = false, keyboardAware = false,
  keyboardVerticalOffset = 0, edges, style, contentStyle,
  className = '', contentClassName = '', scrollViewProps, testID,
}) {
  const content = ['grow w-full max-w-content self-center p-screen gap-xl', centered ? 'justify-center' : '', contentClassName].join(' ');
  return (
    <SafeAreaView edges={edges} testID={testID}
      className={['flex-1 bg-background dark:bg-dark-background', className].join(' ')} style={style}>
      <KeyboardAvoidingView className="flex-1" enabled={keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={keyboardVerticalOffset}>
        {scroll ? (
          <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
            {...scrollViewProps} className="flex-1"
            contentContainerClassName={content} contentContainerStyle={contentStyle}>
            {children}
          </ScrollView>
        ) : <View className={['flex-1', content].join(' ')} style={contentStyle}>{children}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
