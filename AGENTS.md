This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Maivelle project rules

- User-approved stack migration: keep native Android with Expo/React Native,
  use JavaScript/JSX and NativeWind 4 + Tailwind 3. Do not reintroduce TypeScript
  source files or a tsconfig. `jsconfig.json` owns aliases. Functional
  Architecture v1.1 remains approved; this is its explicit stack override.

- Architecture v1.1: single owner, offline-first Android app. Local persistence,
  security, and services are the backend; never add a remote backend, analytics,
  ads, family sharing, or cloud synchronization.
- Read `docs/architecture.md` before implementing a module. Reserved folders and
  JavaScript scaffold files are explicitly unimplemented. Never present them as
  working persistence or security.
- Brand Identity v1.0 is the visual reference. Use `src/frontend/theme/tokens.js` as the
  only runtime design-token source and `useAppTheme` from `@/frontend/theme` in new UI.
  Do not create a second palette, spacing scale, or design system. All app UI
  must consume the shared theme directly; demo compatibility helpers are removed.
- Reuse the shared AppText, Button, Card, TextField, Screen, ScreenHeader, and
  state components from `@/frontend/components`. Read `docs/components.md` before
  adding UI; compose these primitives for feature-specific needs. Run
  `npm.cmd run test:ui` after changing the shared component library.
- Use the supplied artwork via `src/frontend/constants/assets.js`; do not redesign it.
  See `docs/branding/README.md` for source assets and resolved kit differences.
- Preserve Home / Plan / Notes / Vault / More and the single route root `src/app`.
  Do not add empty .jsx route files or duplicate `/` routes while scaffolding.
- The user requested frontend/backend grouping. Actual UI belongs in
  `src/frontend`, local database/security/services in `src/backend`, and common
  types/pure helpers in `src/shared`. Keep `src/app` files as thin route wrappers.
  The backend is bundled local code, not a remote service. Backend must not
  import frontend; shared modules must not depend on either layer.
- Keep changes small and validate them. Ask before the next major phase, as
  required by the user's development brief.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npm run test:ui             # UI semantics, contrast, NativeWind compilation
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and test:ui before declaring UI changes done. Validate Android bundling
after changes to Babel, Metro, routing, or NativeWind. TypeScript checks no longer
apply to this JavaScript project.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.jsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
