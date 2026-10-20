# Phase 1: core UI completion

The implementation covers the remaining core interfaces using the existing
branding tokens, components and supplied artwork. Security and persistence are
still Phase 3 work. No real passwords should be entered into setup/unlock previews.

## Review walkthrough

1. Restart the app to see Welcome. Choose **Get started**.
2. Setup has app password, separate Vault password, and recovery explanation
   steps. Continue with empty/mismatched inputs to review errors; **Use demo
   values** fills public sample passwords. Each step discards the prior inputs.
3. **Open app preview** enters Home and the existing five tabs. Nothing is saved
   or locked. **Explore app preview** on Welcome also opens Home directly.
4. More → **Generate password**: adjust length (8–128), change character groups,
   generate, reveal/hide. At least one group is required. Generated output clears
   when settings change, the screen loses focus, or the app backgrounds.
5. Vault → **Preview add credential** → **Generate password** reaches the same
   generator. Saving/copying remain unavailable; output never travels in route
   parameters or into a plaintext credential store.
6. Settings → **App lock** or **Vault unlock preview** demonstrates masked input,
   visibility, wrong-password feedback, demo unlock, and recovery navigation.
   Public demo values are shown on screen. Vault also links to its unlock preview.
7. Settings → **Welcome and setup preview** replays onboarding.

Demo unlock only navigates to sample screens. It does not authenticate, encrypt,
set a password, restrict deep links, or establish protection. Recovery explains
future offline keys; no working key/reset/export is offered.

## Run on Android

From `D:\Maivelle App\maivelle`:

```powershell
npx.cmd expo start --dev-client --clear
```

Install the updated development APK containing `expo-crypto` before testing
generation. The earlier APK can open the UI, but generation shows an unavailable
message when its native module is missing. To create an updated development APK:

```powershell
npx.cmd eas-cli@latest build --platform android --profile development
```

Install the APK from the resulting build page and reopen it against Metro.
The Phase 1 development build is
[8d303351](https://expo.dev/accounts/devdb01/projects/maivelle/builds/8d303351-d471-4c23-ae3e-d00460b1f1a7).
Its page shows the live build status and provides installation once finished.
Build result: **FINISHED**. [Download the development APK](https://expo.dev/artifacts/eas/3Huup_XSFULp_UznM48DaZ9YgwZk1CzrURoFHf-flvE.apk).
This development APK still needs Metro; it is not the standalone release.
See [Android build notes](android-build.md) for connection and build details.

## Validation and checkpoint

The automated suite has 24 passing checks. Generator tests cover selected groups,
length, rejection sampling, invalid input, provider failure, invalid byte output,
and bounded failure for unusable randomness. Lint and Android/web exports pass.
Browser checks cover setup validation and navigation, app/Vault demo unlock and
recovery, actual secure generation on localhost, reveal/hide, output clearing,
disabled generation with no groups, and 320px/412px light/dark layouts without
horizontal overflow or runtime exceptions.

Physical Android keyboard, Back gestures, background clearing, TalkBack, and
larger system text still need device review. UI approval is pending; Phase 2
Android review and Phase 3 security/database work have not started.

Previews: [Welcome](previews/welcome-light.png), [setup](previews/setup-light.png),
[app unlock](previews/app-unlock-light.png),
[Vault unlock](previews/vault-unlock-light.png),
[generator](previews/generator-light.png),
[dark generator](previews/generator-dark-small.png).
