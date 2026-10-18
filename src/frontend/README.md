# Frontend

All visual app code lives here: reusable components, feature UI, navigation,
hooks, UI stores, theme tokens, and brand/navigation constants.

Use `@/frontend/theme` for the shared design system. Frontend feature hooks
access `@/backend/database/repositories` and `@/backend/services` when those
layers are implemented. Common contracts and pure helpers live in `@/shared`.

Expo Router discovers routes through thin wrappers in `src/app`. Do not create
another route root or place non-screen modules in the route directory.

See [the architecture guide](../../docs/architecture.md).
