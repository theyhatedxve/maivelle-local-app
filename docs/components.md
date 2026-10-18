# Shared Maivelle components

Import UI from `@/frontend/components`. The library uses Brand Identity v1.0
tokens from `src/frontend/theme/tokens.js`; there is no separate palette or
component-library dependency. Components use NativeWind classes generated from
these tokens; the entry screen already uses `Screen` and
`AppText` through this public API.

## Available components

| Component | Location | Contract |
| --- | --- | --- |
| AppText | ui/app-text.jsx | Display, page/section/card titles, body, large body, button, caption; default/secondary/primary/error tones |
| Button | ui/button.jsx | Primary, secondary, danger; loading/disabled states; at least 48px touch target |
| Card | ui/card.jsx | Default or selected surface, 20px radius; presentation only, not an implicit button |
| TextField | forms/text-field.jsx | Visible label, native input props/ref, focus styling, hint/error, masked input, multiline |
| Screen | layout/screen.jsx | Theme background, safe areas, 20px padding, responsive width, scrolling, optional keyboard avoidance |
| ScreenHeader | layout/screen-header.jsx | Page title, subtitle, optional trailing action |
| EmptyState | ui/empty-state.jsx | Title, optional description and action |
| LoadingState | ui/loading-state.jsx | Named busy/progress state |
| ErrorState | ui/error-state.jsx | Safe user-facing message, optional retry action |

## Composition

Use real local state and repository operations when building feature screens.
This example shows composition only; it is not a storage implementation:

```jsx
import { useState } from 'react';
import { Button, Card, Screen, ScreenHeader, TextField } from '@/frontend/components';

export function NoteTitleForm({ onSave }) {
  const [title, setTitle] = useState('');

  return (
    <Screen keyboardAware>
      <ScreenHeader title="New note" />
      <Card>
        <TextField label="Title" value={title} onChangeText={setTitle} />
      </Card>
      <Button label="Save" disabled={!title.trim()} onPress={() => onSave(title.trim())} />
    </Screen>
  );
}
```

Button's `loading` state also disables presses; `onPress` is removed while
unavailable. The component does not manage async operations: the feature owns
pending state and errors. Loading/disabled semantics are exposed to both native
accessibility and React Native Web through supported ARIA props.

TextField displays an error in preference to a hint and announces it as an
alert. A supplied accessibility label overrides its visual-label association.
Set `editable={false}` for an unavailable field. The native `ref` supports native
focus management. Password masking disables correction/spellcheck and defaults
autofill to off, but provides no storage encryption or vault authentication.

Screen scrolls by default. Use `keyboardAware` for forms and set
`keyboardVerticalOffset` when a surrounding header requires it. Adjust `edges`
when a navigator already supplies the bottom safe area. Scrolling allows large
text and long forms to remain reachable; avoid fixed screen heights.

For empty/error actions, pass `action={{ label: 'Retry', onPress: retry }}` or
the actual feature action. Do not show secrets, SQL messages, or stack traces
in error descriptions. States do not fetch data or simulate feature operations.

## Design constraints

- Use the shared components first. New feature-specific components should
  compose these primitives and consume `useAppTheme`, not invent design tokens.
- Use `className` for layout, with semantic utilities such as `gap-md`, `p-screen`,
  `rounded-button`, and `bg-surface dark:bg-dark-surface`. Colors, spacing, radii,
  and typography are generated from tokens by tailwind.config.js.
- `style` remains an escape hatch for runtime geometry/native integration; avoid
  arbitrary palette colors, font sizes, or spacing in feature screens.
- Text supports platform font scaling. Custom Plus Jakarta Sans and Inter files
  are not installed; platform fallbacks are active.
- Component input/button heights are minimums, so labels can grow with text.
- The kit's base error red remains `colors.status.error`. Small error text and
  danger-button backgrounds use centralized contrast variants (`errorText`).
- Line heights complete the kit's type scale; no custom fonts, icons, artwork,
  network calls, storage, or backend dependencies were added.

## Validation

```powershell
npm.cmd run test:ui
npx.cmd expo lint
```

Eight semantic/contrast tests render components through React Native Web and check
button busy/disabled semantics, field labels and validation, password masking,
state actions, heading roles, and at least 4.5:1 contrast for the tested small
text/button pairs in both themes. The test loader uses existing Expo Babel
dependencies; it is not imported by the app. A ninth test compiles Tailwind CSS
through NativeWind's native converter and checks touch targets, spacing, radii,
typography, theme colors, and dark-mode rules. Tests contain no personal records.
A tenth check parses all app source as JavaScript/JSX without TypeScript syntax.

These tests do not simulate native touches, keyboard motion, TalkBack, or device
font scaling. On Android, verify those interactions as the components are used
in the next real feature screens. Check both themes, larger text, field focus,
multiline scrolling, disabled/loading buttons, and keyboard visibility.
