# tests

`ui-components.test.cjs` contains ten JavaScript migration, accessibility, contrast, and NativeWind compilation checks
for the shared UI library. Run `npm.cmd run test:ui`. It uses Node's test runner,
React Native Web, and existing Expo Babel dependencies; no test framework was added.

Native touch, keyboard, TalkBack, and font-scaling checks remain manual. Planned
feature checks cover repositories/migrations, vault locking/encryption, backup
integrity/restore, money arithmetic, restart-safe timers, and reminders.

See [the architecture guide](../docs/architecture.md) for boundaries and implementation status.

