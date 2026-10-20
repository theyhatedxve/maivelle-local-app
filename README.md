# Maivelle

Everything You Value, in One Place.

A single-owner, offline-first Android app built with Expo SDK 58, React Native,
JavaScript/JSX, and NativeWind. Architecture v1.1 is the approved product specification;
Brand Identity v1.0 is the visual reference.

## Start here

- [Project structure and implementation status](docs/architecture.md)
- [Brand tokens and supplied assets](docs/branding/README.md)
- [Shared UI components and usage](docs/components.md)
- [JavaScript and NativeWind migration](docs/nativewind-migration.md)
- [Windows, EAS, and Android device instructions](docs/android-build.md)
- [Phase 1 screens and review walkthrough](docs/phase-one.md)
- [Original branding kit](docs/branding/Maivelle_Complete_Branding_Kit.pdf)

## Development

Run from `D:\Maivelle App\maivelle` in PowerShell:

```powershell
npx.cmd expo start --dev-client --host lan --clear
```

Use the installed Maivelle development APK. For USB, enable USB debugging,
run `adb reverse tcp:8081 tcp:8081`, and connect the development launcher to
`http://127.0.0.1:8081`. ADB must be installed/on PATH or invoked by full path.

```powershell
npm.cmd run test:ui
npx.cmd expo lint
```

## Current scope

Source organization:

- `src/frontend`: components, feature UI, navigation, hooks, stores, and branding.
- `src/backend`: local database, security, and services (still scaffolds).
- `src/shared`: shared types and pure utilities.
- `src/app`: thin Expo Router entry wrappers and reserved route folders.

The Home / Plan / Notes / Vault / More navigation foundation is active. Home
follows the approved pastel UI reference with the supplied app icon, summary
tiles, and upcoming tasks. Plan includes calendar/day-agenda and task views with
search, filters, and sample completion toggles. Notes has a searchable list and
full-screen editor with favorites, pins, Markdown tools, and checklists. New
preview notes and edits live only in memory and reset on reload. Vault has
fictional list/detail/form screens with filters, favorites, and a masked sample
password. Secure saving, copying, and real unlock are not implemented.
The credential form discards edits on exit; do not use it for real credentials.
Income Tracker has sample monthly/all-time totals, category filters, a bar
chart, and recent entries. Open it from More or the Home income tile. Its
Log income form validates amounts/dates but cannot save yet.
More links to Income, Password Generator, Settings, Privacy, and About; upcoming tools have clear status
labels. Settings follows the system theme and does not enable protection,
backups, or reminders. Plan add/edit actions still await storage. Home
records are clearly labeled sample data. The folder
map, brand tokens, asset registry, and module scaffolds are prepared.
Welcome now opens on a fresh app session. Get started walks through demo setup;
Explore app preview enters the tabs. Settings can replay welcome/setup and
app/Vault unlock previews. These flows use public demo values and enable no
protection. Password Generator uses secure Expo Crypto random bytes, supports
8–128 characters and selectable groups, masks output initially, and clears on
leave/background. Install an updated development APK for this native module.
Persistent application features remain unimplemented. No database, vault,
app lock, reminders, or backups should be considered functional or secure.

New UI uses `src/frontend/theme/tokens.js` through `useAppTheme`. Do not create another
palette or redesign the supplied logos. Custom fonts are specified but not yet
installed. Native icon/splash configuration changes require another EAS build.

Keep personal records, keys, and backups outside the source tree. There is no
remote backend, analytics, cloud sync, advertising, or family sharing.

Expo tutorials, sample artwork, demo components, and the reset script have been
removed. Reload to see Welcome and enter the app preview. Verify the screens,
Android Back history, keyboard, both themes, and larger text on the phone.
Phase 1 implementation is ready for review; Phase 2 has not started.
