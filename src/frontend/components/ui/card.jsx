import { View } from 'react-native';

export function Card({ variant = 'default', className = '', style, ...props }) {
  return (
    <View {...props}
      className={['p-screen rounded-xl border border-border dark:border-dark-border', variant === 'selected' ? 'bg-surface-selected dark:bg-dark-surface-selected' : 'bg-surface dark:bg-dark-surface', className].join(' ')}
      style={style}
    />
  );
}
