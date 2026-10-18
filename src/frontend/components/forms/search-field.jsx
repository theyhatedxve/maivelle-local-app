import { AppIcon } from '../ui/app-icon';
import { TextField } from './text-field';

export function SearchField({ label = 'Search', placeholder = 'Search...', ...props }) {
  return <TextField {...props} label={label} placeholder={placeholder}
    autoCapitalize="none" autoCorrect={false} returnKeyType="search"
    leading={<AppIcon name="search-outline" />} />;
}
