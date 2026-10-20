import { useState } from 'react';
import { View } from 'react-native';
import { IconButton, TextField } from '@/frontend/components';

export function PreviewPasswordField({ label, ...props }) {
  const [visible, setVisible] = useState(false);
  return <View className="flex-row items-end gap-sm">
    <View className="flex-1"><TextField {...props} label={label} secureTextEntry={!visible} autoCapitalize="none" autoComplete="off" importantForAutofill="no" autoCorrect={false} spellCheck={false} /></View>
    <IconButton icon={visible ? 'eye-off-outline' : 'eye-outline'} label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} onPress={() => setVisible(!visible)} />
  </View>;
}
