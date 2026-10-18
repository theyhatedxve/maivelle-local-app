# Maivelle project map

Architecture v1.1 remains the approved functional specification. Brand Identity
v1.0 defines the visual system. This is an Android, single-owner, offline-first
application. Its backend is local SQLite, repositories, security, and services;
there is no server, remote login, cloud database, or synchronization service.

The user approved JavaScript/JSX and NativeWind 4 + Tailwind 3 as implementation
stack overrides. See [the migration record](nativewind-migration.md). The
functional architecture and frontend/backend grouping are unchanged.

## Directory map

```text
maivelle/
  src/
    app/                  Expo Router entry points only
      _layout.jsx         Thin wrapper for frontend/navigation/root-layout
      index.jsx           Thin wrapper for frontend/components/layout/brand-entry
      (onboarding)/       Reserved: welcome and first setup
      (auth)/             Reserved: app setup and unlock
      (tabs)/             Reserved: Home, Plan, Notes, Vault, More
      notes/ tasks/ events/ vault/
      finance/ budgets/ medicine/ time-tracker/
      search/ settings/ folders/ activity-log/
    frontend/
      components/
        ui/               Shared text, cards, buttons, fields, and states
        layout/           Screen containers, headers, brand entry
        forms/            Shared form presentation
        charts/           Local-data visualizations
      features/
        dashboard/ notes/ tasks/ calendar/ vault/
        finance/ budgets/ medicine/ time-tracker/
        search/ settings/ folders/ activity-log/
      navigation/         Root layout and future navigator implementations
      stores/             Small transient app/UI state
      hooks/              Shared React hooks
      theme/              Canonical design tokens and theme hook
      constants/          Brand copy, asset registry, navigation labels
    backend/
      database/
        connection/       SQLCipher lifecycle and secure key loading
        migrations/       Versioned transactional schema changes
        schemas/          SQL row types, constraints, and indexes
        repositories/     Feature-facing persistence entry point
      security/
        app-lock/         Application authentication
        encryption/       Audited cryptographic library integration
        vault/            Separate unlock, key lifetime, recovery
      services/
        notifications/    Android local reminder scheduling
        backups/          Versioned encrypted export/restore
        reports/          Local aggregates
        files/            Protected local attachments and file selection
    shared/
      types/              Cross-layer domain primitives
      utils/              Pure helpers, including money arithmetic
  assets/
    images/brand/         Three original supplied PNGs, unchanged
    icons/                Reserved UI icon assets
    fonts/                Reserved licensed local font assets
  tests/                  Planned behavior, persistence, and security checks
  docs/
    architecture.md       This map and module boundaries
    branding/             Original kit and implementation decisions
    android-build.md      EAS, Windows, and device workflow
  app.json                Native configuration and linked EAS identity
  eas.json                Development, preview APK, production AAB profiles
```

This folder reorganization was explicitly requested by the user. Functional
Architecture v1.1 and Brand Identity v1.0 are unchanged. The backend remains
local code shipped inside the app, not a server or separate deployable project.

Each frontend feature has a `types.js` scaffold with its purpose documented in
the file. Supporting layers
have small, explicitly unimplemented JavaScript files. These export no runtime
functions. They are locations for future work, not completed services.
Subfolders for feature screens/components/hooks are added with their first real
implementation rather than repeated empty folders for every feature.

Keep feature presentation models in `types.js`; add `validation.js` for Zod
schemas when forms are implemented. Feature `screens/`, `components/`, and
`hooks/` folders belong beside those models when needed. Screens must not contain
SQL or cryptographic implementation. This guide and the shared component guide
own these conventions instead of repeating a README in each implementation folder.

## Dependency flow

`src/app` contains only Expo Router route wrappers and reserved route folders.
The root wrapper re-exports `frontend/navigation/root-layout.jsx`; the index
wrapper re-exports `frontend/components/layout/brand-entry.jsx`. All actual UI
implementations live in `frontend`. Keep one conventional route root rather
than configuring a custom router directory or creating duplicate entry points.

Frontend feature hooks call backend repositories and services.
Repositories access the encrypted database. Security controls access to keys
and protected data. Components read shared tokens; they do not open databases.
Use Zustand for lightweight UI state, not as a second persistent database.

- Keep SQL row models in `backend/database/schemas`, feature-specific presentation
  types with the frontend feature, and cross-layer domain contracts in `shared/types`.
- Backend code must not depend on frontend code. Shared types/utilities must not
  depend on either layer. Frontend accesses persistence through repositories/services.
- Shared income/expense transactions drive budget spending calculations.
- Calendar reads task schedules without creating duplicate event rows for tasks.
- Global search excludes vault data; vault search requires separate unlock.
- Store money in integer minor units with explicit currency.
- Persist timer timestamps, not just an in-memory ticking counter.
- Never add plaintext storage/encryption fallbacks to make a scaffold appear ready.

## Navigation rollout

The reserved route folders contain README files only. Do not add empty `.jsx`
files: Expo expects each route to export a working screen. When five-tab
navigation is implemented, move or replace the temporary brand entry and current
navigation together. Do not create both `src/app/index.jsx` and
`src/app/(tabs)/index.jsx` as independent `/` routes. There is one route root:
`src/app`, never a second top-level `app` folder. Keep route files thin and put
their UI/navigation implementations in `frontend`.

Editors/details may use full-screen stack navigation; the five primary tabs
retain bottom navigation. The inventory of 29 screens is a plan, not 29 required
separate files. Reuse editors and modals where appropriate.

## Current implementation status

Working: Expo SDK 58 project, minimal Maivelle brand entry, physical Android development-build connection,
EAS project linking/build profiles, JavaScript alias/lint configuration, brand token
exports, theme hook, brand constants, and original asset registry.

Implemented shared UI: AppText, Button, Card, TextField, Screen, ScreenHeader,
EmptyState, LoadingState, ErrorState. The brand entry consumes Screen/AppText.
See [component API and checks](components.md). Feature CRUD, authentication, and
the five-tab navigator remain unimplemented.

Scaffold only: feature models, repositories, schema/migrations, notifications,
backups, reports, attachment handling, stores, money helpers, and security.
No database encryption, vault, app lock, CRUD, reminders, reports, or restore
behavior is implemented. SQLCipher/SecureStore/Zustand/Zod and associated native
modules have not been added. Add compatible dependencies with each approved step.

Expo tutorial routes, demo components, sample artwork, and the reset script are
removed. The former theme compatibility facade is also removed: UI imports
`@/frontend/theme` directly. The original supplied assets, brand PDF, feature scaffolds,
developer configuration, and EAS setup remain. Temporary inspection copies and
PDF-reading tools have been deleted; they were not application dependencies.

Unused direct demo dependencies (`@expo/ui`, `expo-device`, `expo-glass-effect`,
`expo-symbols`, and `expo-web-browser`) are removed. Keep the core Expo Router
and native navigation dependencies. Add future dependencies only with their
implemented feature and the SDK-compatible Expo installer.

The npm commands target Android and local web preview. Web server deployment
configuration and the unused iOS command are removed. EAS uploads exclude
documentation, tests, and folder READMEs; those files remain available locally.

## Checks

```powershell
npm.cmd run test:ui
npx.cmd expo lint
```

Use focused behavior tests when implementation arrives, particularly for
encryption/locking, migration/restore integrity, reminder rescheduling, money,
and restart-safe timers. Never commit private records, keys, or backups.
