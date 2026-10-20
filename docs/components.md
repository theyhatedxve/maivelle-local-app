# Shared Maivelle components

Import UI from `@/frontend/components`. The library uses Brand Identity v1.0
tokens from `src/frontend/theme/tokens.js`; there is no separate palette or
component-library dependency. Components use NativeWind classes generated from
these tokens; the tab screens use `Screen`, `ScreenHeader`, `Card`, and
`AppText` through this public API. All five tabs now have their own UI; the
former generic tab-placeholder component has been removed.

## Available components

| Component | Location | Contract |
| --- | --- | --- |
| AppText | ui/app-text.jsx | Display, page/section/card titles, body, large body, button, caption; default/secondary/primary/success/error tones |
| Button | ui/button.jsx | Primary, secondary, danger; loading/disabled states; at least 48px touch target |
| Card | ui/card.jsx | Default, selected, or muted surface; optional compact spacing/radius; presentation only |
| AppIcon | ui/app-icon.jsx | Decorative local Ionicons glyph, theme size and color |
| IconButton | ui/icon-button.jsx | Named circular icon control, 48px minimum target, disabled semantics |
| SummaryTile | ui/summary-tile.jsx | Compact card with icon, label, value, and named navigation action |
| SearchField | forms/search-field.jsx | Labeled TextField with search icon and search keyboard action |
| SegmentedControl | ui/segmented-control.jsx | Labeled choice group, selected state, wrapping layout, 48px minimum targets |
| MenuRow | ui/menu-row.jsx | Icon and label, optional value/description; a named button only when an action exists |
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

Button accepts a decorative `leading` node for icon actions. TextField accepts
a decorative `leading` node inside its tinted input container. SearchField
composes TextField; it does not fetch or filter data by itself.

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
- Line heights complete the kit's type scale. Ionicons are bundled locally via
  the Expo-compatible @expo/vector-icons package and existing expo-font module.
  Brand fonts remain platform fallbacks. No network-backed UI or storage was added.

The user-approved pastel reference is preserved at
`docs/branding/maivelle-pastel-ui-reference.png`. The PDF still owns exact brand
values; the image guides composition. Central tokens add a muted input surface
and contrast-safe income text for light/dark modes. Shared components supply
the Home dashboard layout and the icon tabs without a separate design system.

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
Three Plan checks cover calendar month/year boundaries and leap years, complete
Sunday-first grids, and segmented-control selected-state semantics (13 total).

These tests do not simulate native touches, keyboard motion, TalkBack, or device
font scaling. On Android, verify those interactions as the components are used
in the next real feature screens. Check both themes, larger text, field focus,
multiline scrolling, disabled/loading buttons, and keyboard visibility.

The Home UI step also passed Android/web exports and a local headless-browser
review at 412px and 320px widths in light/dark themes. The review checked all
four summary shortcuts, the header shortcut, View all, and Notes/Home tabs with
no runtime exceptions. Browser screenshots: [light](previews/home-dashboard-light.png)
and [dark](previews/home-dashboard-dark.png). These are web-rendered previews;
physical Android touch, TalkBack, font scaling, and keyboard checks remain pending.

Plan composes the same library with MonthCalendar/DayAgenda in `features/calendar`
and TaskPreviewList in `features/tasks`. No calendar or state library was added.
Local dates use noon and local date keys, with end-of-month clamping. The calendar
scrolls horizontally when seven 48px targets cannot fit, including larger text.
Tasks support title/tag search, priority/status filtering, and completion/undo
on disposable sample state. Add buttons are disabled until storage is implemented.
The browser interaction review passed those controls, month navigation, marked
day selection, Today, empty results, light/dark modes, and 320px widths without
runtime exceptions. Previews: [Calendar](previews/plan-calendar-light.png),
[Tasks](previews/plan-tasks-light.png), [dark Tasks](previews/plan-tasks-dark.png).
Android touch, keyboard, TalkBack, and system font scaling remain manual checks.

Notes uses the same components for a searchable list, favorite/checklist
filters, and the full-screen editor. Its context in `features/notes/stores`
contains disposable preview data only; it is not a persistence layer. Plain-text
Markdown tools wrap the current selection, or insert a placeholder at the caret.
The web editor reads the host input range before insertion to avoid stale
selection events. Checklists support add, edit, toggle, and remove. Two more
tests cover search/sort/filter behavior and Markdown selection boundaries
(15 total). Rich-text rendering, permanent saving, folders, and attachments are
future work.
The Notes browser review passed list/editor navigation, search/empty results,
favorite filtering, pins, text/tag edits, selected-text formatting, checklist
controls, preview creation, state reset on reload, and missing-note recovery.
Light/dark layouts at 412px and 320px had no horizontal overflow or runtime
exceptions. Previews: [Notes](previews/notes-list-light.png),
[editor](previews/notes-editor-light.png), [dark Notes](previews/notes-list-dark.png).
Native Android keyboard, selection, Back navigation, TalkBack, and larger-font
checks still need a phone.

Vault reuses the same library for search/tag/favorite filters, fictional record
details, and a credential form preview. Feature components VaultPreviewNotice
and DemoPassword own the repeated demo notice and masked/revealed sample value.
Reveal resets on route blur. Only favorites change across screens; the form
has no save operation. Saving, clipboard copying, and password generation are
visibly disabled; sample websites are plain text. No branded favicons or remote
images are fetched. The metadata filter excludes password values.

All 16 tests pass, including the new metadata/tag/favorite/password-exclusion
check. Android/web export and browser checks passed navigation, filtering,
favorite consistency, reveal/blur reset, form prefill/discard, unavailable
controls, missing IDs, reload reset, and light/dark 320px layouts with no runtime
exceptions. Previews: [Vault list](previews/vault-list-light.png),
[detail](previews/vault-detail-light.png), [form](previews/vault-form-light.png),
[dark form](previews/vault-form-dark.png). Physical Android touch, keyboard,
Back navigation, and TalkBack checks remain pending. This validates UI behavior,
not vault security, which remains unimplemented.

More and Settings compose MenuRow inside shared cards. An action makes MenuRow
a named button with a chevron; no action makes it read-only text with an
optional current value/status. SettingsHeader provides reusable stack Back
navigation with a More fallback. Theme values follow the existing system theme;
no alternate palette or preference store was introduced. About reads the version
from Expo configuration using the existing expo-constants module.

The 16 existing tests, lint, Android/web export, and local browser review pass.
The browser review checked More/Settings/Privacy/About navigation, direct-link
Back fallback, system light/dark updates, read-only unavailable options, app
version, and 320px layouts with no overflow or runtime exceptions. Previews:
[More](previews/more-menu-light.png), [Settings](previews/settings-light.png),
[dark Settings](previews/settings-dark.png), [About](previews/about-light.png).
Physical Android Back, TalkBack, system theme changes, and larger text remain
manual checks. Settings does not enable protection, reminders, or backups.

Income composes the same screens/cards/controls with a small native View-based
bar chart; no chart package was added. Its eight fictional PHP entries cover
the current and previous month. Month/category filters, totals, charts, and
recent/all entry lists share the same filtered records. Weekly groups mean
days 1–7, 8–14, etc.; narrow screens can scroll the chart horizontally. Each bar
has an accessible period/amount label. Values use integer centavos and are
formatted without floating-point division. The form accepts plain decimal
amounts and ISO calendar dates, shows validation/amount previews, and disables
saving. Fields reset on exit. These helpers implement the preview only, not
accounts, financial reports, budgets, or storage.

Formatting splits integer decimal digits and passes only the whole-peso Number
to native Intl, keeping the centavos separate. This avoids the Android
`Cannot convert BigInt to number` crash. A regression test reproduces native
Intl rejecting BigInt and checks zero, sub-peso amounts, and the safe-integer
limit.

All 20 tests pass, including exact amount parsing, date validity, period/category/
currency/kind filtering, safe-integer limits, and chart/total reconciliation.
Lint and Android/web exports pass. Browser checks cover both entry shortcuts,
filters/totals, all/recent entries, validation, form prefill/discard, unavailable
saving, direct-link Back fallback, and light/dark 320px layouts without runtime
exceptions. Previews: [Income](previews/income-light.png),
[Categories](previews/income-categories-light.png),
[form](previews/income-form-light.png), [dark form](previews/income-form-dark.png).
Physical Android keyboard, formatting, Back, TalkBack and large text remain
manual checks.

Phase 1 composes the existing primitives into Welcome/setup/recovery and
app/Vault unlock previews. PreviewPasswordField pairs the shared masked field
with a labeled reveal/hide action; no alternative design tokens were added.
Password Generator uses shared controls and theme-colored native switches,
accessible length steppers, and initially masked secure random output. Output
clears on blur/background or settings changes. There is no strength claim,
clipboard integration, or Vault saving. The setup and unlock flows cannot
enable protection. See [Phase 1 review](phase-one.md) for checks and screenshots.
