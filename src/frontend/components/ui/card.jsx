import { View } from 'react-native';

const surfaces = {
  default: 'bg-surface dark:bg-dark-surface',
  selected: 'bg-surface-selected dark:bg-dark-surface-selected',
  muted: 'bg-surface-muted dark:bg-dark-surface-muted',
};

export function Card({ variant = 'default', compact = false, className = '', style, ...props }) {
  return (
    <View {...props}
      className={[compact ? 'p-lg rounded-lg' : 'p-screen rounded-xl', 'border border-border dark:border-dark-border', surfaces[variant] ?? surfaces.default, className].join(' ')}
      style={style}
    />
  );
}
