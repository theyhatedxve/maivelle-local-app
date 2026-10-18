# JavaScript and NativeWind migration

The user explicitly selected native Android + React Native + Expo + NativeWind
and conversion to JavaScript/JSX. These choices override the original TypeScript
and StyleSheet implementation requirements. Architecture v1.1's offline-only,
single-owner product and local security/storage requirements are unchanged.
Maivelle remains a native app, not a React DOM website or Vite project.

## Source and configuration

- All 53 former app `.ts`/`.tsx` modules are now `.js`/`.jsx`, including backend
  scaffolds and thin Expo Router wrappers. No TypeScript source remains in src.
- `jsconfig.json` owns existing source/asset aliases. ESLint reads this same
  file to resolve imports. There is no tsconfig or TypeScript check command.
- Expo typed-route generation is disabled. NativeWind's TypeScript declaration
  generation is disabled because the application is JavaScript.
- NativeWind 4.2.7 and Tailwind CSS 3 are used. The pre-release v5 stack was not
  introduced. Expo-compatible Reanimated, Worklets, and Safe Area versions remain.
- Babel uses the Expo and NativeWind presets. Metro wraps Expo's default config
  with NativeWind; its CSS entry is src/frontend/theme/global.css.
- The router root imports CSS once. Actual navigation/UI stay in frontend;
  database/security/services stay in backend; shared helpers stay in shared.

## One branding system

`src/frontend/theme/tokens.js` is the same canonical branding source, expressed
as CommonJS so both Metro and the Node-based Tailwind config can load it without
a TypeScript loader. All other application modules use normal ES imports/exports.

`tailwind.config.js` generates colors, spacing, typography, radii, touch sizes,
and content widths from those tokens. Default Tailwind color/type/spacing scales
are replaced; do not add a separate palette or arbitrary values in feature UI.

The shared components now use className utilities and preserve their original
behavior/accessibility. Dynamic native props, such as ActivityIndicator color,
TextInput selection/placeholder colors, and navigator options, use useAppTheme.
SafeAreaView and ScrollView use NativeWind's interop; Expo Image is explicitly
registered with cssInterop. Dark variants follow the system appearance.

Component APIs remain compatible and add className. Screen adds
contentClassName; TextField adds containerClassName. Use variants/tone for
component colors rather than conflicting color classes. The supplied logos,
native icons, fonts/fallback status, and base color values are preserved.

## Windows verification

Stop the previous Metro process (Ctrl+C), then restart after this Babel/Metro
configuration change:

```powershell
npx.cmd expo start --dev-client --host lan --clear
```

For USB, re-run `adb reverse tcp:8081 tcp:8081` and connect the installed Maivelle
development client to `http://127.0.0.1:8081`. The first APK already contains the
same Reanimated/Worklets/Safe Area versions; this migration does not change those
native dependencies. No new cloud build was triggered. Updated native icon/splash
artwork from the earlier branding step still requires a separate rebuild.

```powershell
npx.cmd expo lint
npm.cmd run test:ui
npx.cmd expo export --platform android --output-dir .expo/migration-check
```

Lint, ten UI/style/migration tests, and Android bundling validate the migration.
Static rendering checks do not simulate Android touches, TalkBack, keyboard,
appearance changes, or large text. Check those on the phone after restarting Metro.
JavaScript no longer provides the former strict TypeScript checking; feature
validation must still be implemented with Zod when the feature work begins.

## Dependency audit

The migration audit reports 34 findings (22 high, 12 moderate), including existing
Expo/React Native chains and NativeWind/Tailwind build-tool chains. Suggested fixes
include incompatible framework downgrades and Tailwind 4, which stable NativeWind
4 does not support. No forced audit fix was applied. Review advisories and
compatible upstream patches before release. This is not a security-ready app;
database and vault functionality remain unimplemented scaffolds.
