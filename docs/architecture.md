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
      (onboarding)/       Welcome, setup preview, recovery explanation
      (auth)/             App and Vault unlock previews
      (tabs)/             Active: Home, Plan, Notes, Vault, More
        _layout.jsx       Thin wrapper for frontend/navigation/tab-layout
        index.jsx         Home; the only active / route
        plan.jsx notes.jsx vault.jsx more.jsx
      notes/
        [id].jsx          Full-screen note preview editor wrapper
      vault/
        [id].jsx          Fictional credential detail wrapper
        new.jsx           Credential form preview wrapper
        generate-password.jsx Secure random generator wrapper
      tasks/ events/
      finance/
        income.jsx        Income overview wrapper
        log-income.jsx    Income form preview wrapper
      budgets/ medicine/ time-tracker/
      settings/
        index.jsx         Settings wrapper
        about.jsx         About wrapper
        privacy.jsx       Preview privacy information wrapper
      search/ folders/ activity-log/
    frontend/
      components/
        ui/               Shared text, cards, buttons, fields, and states
        layout/           Screen containers and headers
        forms/            Shared form presentation
        charts/           Local-data visualizations
      features/
        onboarding/ auth/ password-generator/
        dashboard/ plan/ notes/ tasks/ calendar/ vault/ more/
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

Reserved frontend modules have a `types.js` scaffold with their purpose documented
in the file. Implemented UI-only features add only the files they need. Supporting layers
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
The root wrapper re-exports `frontend/navigation/root-layout.jsx`; tab wrappers
re-export `frontend/navigation/tab-layout.jsx` and their frontend feature screens. All actual UI
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

The five-tab foundation is active. Home lives at `src/app/(tabs)/index.jsx`;
the former root index and temporary brand-entry component are removed. Plan has
interactive calendar/task sample views; Notes has a searchable list and full-screen
editor. Vault has a fictional credential list/detail/form preview; More links
to Settings, Privacy, and About. Upcoming tools are read-only menu entries.
`plan` and `more` feature
folders compose the existing module areas without adding persistence models.
The icon-and-label tab bar uses the existing theme, honors the bottom safe area,
and grows vertically with font scaling. Android Back follows visited tab history.

Other reserved route folders contain README files only. Do not add empty `.jsx`
files: Expo expects each route to export a working screen. Do not create both
`src/app/index.jsx` and `src/app/(tabs)/index.jsx` as independent `/` routes. There is one route root:
`src/app`, never a second top-level `app` folder. Keep route files thin and put
their UI/navigation implementations in `frontend`.

Editors/details may use full-screen stack navigation; the five primary tabs
retain bottom navigation. The inventory of 29 screens is a plan, not 29 required
separate files. Reuse editors and modals where appropriate.

## Current implementation status

Working: Expo SDK 58 project, five-tab navigation with a pastel Home dashboard and starter
screens, physical Android development-build connection,
EAS project linking/build profiles, JavaScript alias/lint configuration, brand token
exports, theme hook, brand constants, and original asset registry.

Implemented shared UI: AppText, Button, Card, TextField, Screen, ScreenHeader,
EmptyState, LoadingState, ErrorState. Tab screens consume the shared library.
The pastel UI step adds AppIcon, IconButton, SummaryTile, SearchField, compact
cards, and input/button icon slots. Home follows the approved UI reference;
its counts, income, and tasks are explicitly labeled samples stored only in
`frontend/features/dashboard/data/preview.js`. They are never database seeds.
Tile shortcuts, the header icon, and View all open existing tab previews.
Plan switches between a monthly calendar/day agenda and tasks. Search, priority
and status filters, and completion/undo work on sample data only. Samples are
created relative to the date Plan is opened in `features/plan/data/preview.js`.
Task changes survive switching views/tabs but reset on reload; Home totals are
separate static design samples. New event/task actions remain disabled. The
calendar uses local date helpers and preserves 48px targets with horizontal
scrolling on narrow screens. No database, editor, notification scheduling, or
new dependency was introduced in this step.
Notes now has six disposable samples and a root-level NotesPreviewProvider
shared by the Notes tab and `/notes/[id]` editor. Search includes titles, body,
tags, and checklist text. Favorites/checklist filters, pinning, plain-text and
Markdown insertion, and checklist editing work on in-memory state. New preview
notes are also session-only. Edits immediately update the list; returning with
Back does not discard them. Reload resets samples and removes preview drafts.
Missing draft IDs show a return-to-Notes action. No localStorage, SQLite, server,
rich-text renderer, or database repository was added. Home totals remain static
design samples, not live counts from the preview contexts.
Vault now displays six immutable fictional records with reserved `.example`
addresses. Its context changes only session favorite flags. Search/tag/favorite
filters and full-screen detail/form navigation work, but no real credential
store, real unlock, encryption, saving, copying, or external website
opening is implemented. A fixed, public demo password can be revealed and
automatically hides when its route loses focus. The form can be explored and
prefilled with demo values; saving is disabled and values are discarded on exit.
Missing IDs show a return-to-Vault action. No security backend or dependency
was added. Before wiring real records, gate every Vault route on actual unlock
and implement encrypted storage/key handling; these preview routes are not a
plaintext fallback for the security scaffold.
More now has the reference-style tool menu and functional Settings/About links.
Settings shows the current system theme and English app copy; manual theme
selection, saved preferences, app lock, backups, notifications, and data
management remain unavailable. Privacy describes the actual preview behavior.
About uses the supplied icon, brand copy, and version from Expo configuration.
These full-screen routes support Back and direct-link fallback to More. MenuRow
is a shared primitive; rows without actions are read-only, not dead buttons.
The now-unused generic tab placeholder is removed. No new dependency, storage,
permissions request, or backend operation was introduced in this step.
Income Tracker is now available from More and the Home income tile. Fictional
PHP entries drive the monthly/all-time totals, weekly/monthly chart, category
breakdown, and recent/all entry views. Amounts and totals use integer centavos;
formatting preserves cents through the safe integer range. Expense records and
other currencies are excluded rather than mixed. Date keys remain local dates.
The Log income form validates decimal amounts and calendar dates, supports
sample prefilling, and discards edits on exit. Saving remains disabled. No
transactions, budgets, accounts, persistence, or chart library were added.
The shared money scaffold remains separate from these finance preview helpers.
See [component API and checks](components.md). Feature CRUD and authentication
remain unimplemented. Saving stays disabled; unlock interfaces are explicitly
public demos rather than access control.

Phase 1 adds Welcome, three-step setup, recovery explanation, and separate
app/Vault unlock previews. A transient navigation flag routes the initial Home
entry to Welcome and allows exploration; it is not authentication. Setup values
are discarded, never stored or used to configure security. Unlock screens accept
public demo constants only. Every Vault route remains a fictional preview.
Settings can replay the flows; Vault has an unlock-preview shortcut.

The Password Generator is available from More and the credential form. Expo
Crypto's async random bytes API supplies secure randomness. Byte rejection avoids
modulo bias; whole-candidate rejection includes every enabled character group
without fixing positions. Length is 8–128. Invalid settings disable generation;
missing native Crypto fails visibly without a weak randomness fallback. Output
is masked initially and clears on blur/background, settings changes, and pending
operation invalidation. No copy, credential saving, or real unlock is implemented.
The native dependency requires an updated development APK. See
[the Phase 1 review guide](phase-one.md) for the walkthrough and validation.

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
