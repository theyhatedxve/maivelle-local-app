# Maivelle Android builds

Architecture v1.1 is the approved specification. The application is local-only;
EAS compiles source code and must never receive application records or secrets.

## Current setup

- Display name: Maivelle
- Slogan: Everything You Value, in One Place.
- Initial Android application ID: `com.maivelle.app`. Confirm before publishing;
  changing it creates a different Android application.
- Android system backup is disabled with `android.allowBackup: false`.
- Native launcher/splash configuration now references the supplied Maivelle
  artwork and Brand Identity v1.0 colors. A new native build is required to see
  these changes; the first APK still contains the old native assets.
- Expo tutorial screens and animated overlay are removed. The JavaScript entry
  screen now shows Maivelle branding; five-tab navigation is still planned.
- Linked EAS project: `@devdb01/maivelle`.
- Project ID: `e251f00b-1744-4d50-afc7-588e8a712092`.
- First development build: https://expo.dev/accounts/devdb01/projects/maivelle/builds/e0e42196-eb53-402a-b4c4-a01705e9999b
- First build status: FINISHED (Android development APK). The user confirmed the
  app runs on the physical phone through Metro after USB connection repair.

## Windows setup and first development build

Run from `D:\Maivelle App\maivelle` in PowerShell. The `.cmd` suffix avoids the
machine's restriction on PowerShell npm/npx wrappers.

```powershell
npm.cmd run test:ui
npx.cmd expo lint
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest init
npx.cmd eas-cli@latest build --platform android --profile development
```

The existing checkout is already linked; `init` is only needed when establishing
a new link. Verify that the account is `devdb01` using `eas-cli@latest whoami`. EAS may
prompt to create/manage an Android signing key. Cloud builds require no local
Android SDK or JDK.

Install the resulting APK on the phone. Start Metro on the computer:

```powershell
npx.cmd expo start --dev-client --clear
```

Use the same network on the phone and computer and open the development build.
Development builds use Metro; they are not the final offline installation.
Native module/config changes require a new build.

## Standalone builds

`preview` produces an APK with bundled JavaScript for testing in airplane mode
without Metro:

```powershell
npx.cmd eas-cli@latest build --platform android --profile preview
```

`production` produces an Android App Bundle for a future Google Play release,
not a directly installable APK. No release or submission has been performed.

## Private files

Keep real records, vault secrets, database keys, and backups outside the source
tree. `.gitignore` and `.easignore` exclude known database, backup, environment,
and credential paths; they cannot detect secrets inside arbitrary files. Place
local test exports in `private-data/`, `backups/`, or `exports/`. Never put
database/vault keys in EAS environment variables or public Expo config.
Review the build archive before uploading:

```powershell
npx.cmd eas-cli@latest build:inspect --platform android --profile development --stage archive --output .\build-inspection
```

System backup settings still need verification in the generated Android manifest
and on a phone. Device-transfer behavior can vary by Android version/manufacturer.
Database encryption, vault functionality, and user-data storage are not yet built.

## Dependency review

The setup-time npm audit reported 27 findings (19 high, 8 moderate), including
Expo/React Native dependency chains. Its proposed remediations include incompatible
framework downgrades. Do not run `npm audit fix --force`; review the individual
advisories and SDK-compatible updates before release. A passing compatibility
check is not a security audit.
