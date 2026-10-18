# Local backend

- `database/`: SQLCipher connection, migrations, SQL row schemas, repositories.
- `security/`: app authentication, audited encryption integration, vault unlock.
- `services/`: local reminders, encrypted backups, reports, protected files.

This is an in-app backend, not an HTTP server. It has no remote database,
remote authentication, cloud sync, or separate deployment. Modules are still
scaffolds and do not implement persistence or security yet.

Keep React components, theme values, and UI stores out of this layer. Use shared
contracts from `src/shared`; never import `src/frontend`.

See [the architecture guide](../../docs/architecture.md).
