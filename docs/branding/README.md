# Maivelle brand implementation

Source: `Maivelle_Complete_Branding_Kit.pdf`, Brand Identity v1.0, nine pages.
The original PDF is retained unchanged beside this file.

## Source of truth

- `src/frontend/theme/tokens.js`: all runtime colors, spacing, typography sizes/weights,
  radii, layout dimensions, motion durations, and interaction opacity.
- `src/frontend/theme/use-app-theme.js`: one light/dark theme API, with the existing
  hydration-aware color-scheme hook for web.
- `src/frontend/constants/brand.js`: name, slogan, brand voice, and identity versions.
- `src/frontend/constants/assets.js`: one registry for the supplied artwork.

The kit supersedes the original brief's provisional purple/background values:
primary `#6D42B5`, light background `#F8F5FF`, text `#2D1B4E`.
Dark and semantic colors follow pages 2, 4, and 7. Status colors need contrast
checks in their actual context; do not use warning yellow as small text on white
without an accessible presentation.

## Resolved differences

The kit is visual reference data, not an authorization to change architecture:
its family-oriented copy and four-item conceptual navigation do not override
the approved single-owner model or Home / Plan / Notes / Vault / More tabs.

Page 4 specifies a 14px button radius while its sample code uses the generic
12px radius. `radius.button` is 14; `radius.md` remains 12. Light `surfaceRaised`
and `surfaceSelected` complete the shared light/dark token shape. Dark selected
surface uses the documented raised surface. Touch target is at least 48px as
shown in the kit's button sample; screen padding is 20px.

The component library adds line heights to complete the kit's type scale.
Error text uses `#B52B37` in light mode and `#FFADB4` in dark mode for small-text
contrast; the kit's base semantic error `#D64550` is preserved. These adjustments
are centralized in tokens, not feature-specific palettes. See
[the shared component guide](../components.md) for the implemented UI API.

Plus Jakarta Sans headings and Inter body fonts are specified but not installed.
Use platform fonts until licensed font files are added and loaded locally.
Listing a font name does not load it or justify a network font dependency.

## Original assets

| Registry key | Workspace file | Source |
| --- | --- | --- |
| logo | assets/images/brand/maivelle-logo.png | Glossy Purple Heart-M Logo Maivelle.png |
| logoWithSlogan | assets/images/brand/maivelle-logo-with-slogan.png | Maivelle Purple Ribbon Logo.png |
| appIcon | assets/images/brand/maivelle-app-icon.png | Glassy Purple Heart Monogram Icon.png |

Preserve proportions and clear space. These are unchanged raster originals;
no vector mark or adaptive foreground has been fabricated. Use the supplied
standalone app icon for the launcher; use the full logo for brand screens.
`app.json` references these assets for Android icon, native splash, and web
favicon. The template adaptive artwork was removed so it cannot override the
supplied app icon. Native configuration is JSON, so its build-time background
colors mirror `tokens.js`; keep them synchronized when changing brand values.
The Expo splash overlay and tutorial screens are removed. The current entry
screen displays the supplied logo and slogan using the shared theme.
Native icon/splash changes require a new Android development build.

Do not use the PDF presentation board as an icon. Producing dedicated adaptive
foreground/monochrome exports and testing Android icon masks remains a later
asset-preparation step. No image-generation or logo redesign was performed.

## Rules for new UI

Use `useAppTheme()` and shared components. Avoid literal feature-screen colors,
new spacing scales, or alternate fonts. Use `BRAND_ASSETS` for brand imagery
and `BRAND_COPY` where the kit provides copy. Calm wording must describe actual
behavior; branding alone does not establish encryption or security.
