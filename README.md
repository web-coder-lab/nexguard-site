# NEXGUARD website (static, no dependencies)

Build: `node build.mjs` (output in `dist/`). Deploy on Render as a Static Site: build command `node build.mjs`, publish directory `dist` (see `render.yaml`). Set the `SITE_URL` env var to your Render URL to enable canonical links and `sitemap.xml`.

## Structure
- `build.mjs`: page generator. `tools/md.mjs`: Markdown to HTML. `tools/tree.mjs`: source file tree.
- `src/pages/`: one HTML file per page (home, app, download, source, screenshots, features, how-it-works, phones, faq, changelog, security, privacy, terms, license, about, contact, 404).
- `src/templates/`: feature and phone-guide pages, built from data.
- `src/partials/`, `src/layouts/`: header, footer, base layout.
- `src/data/*.json`: all content (site facts, features, phone guides, releases, FAQ, permissions, screenshots, source tree).
- `src/content/*.md`: README, CHANGELOG and SECURITY copied from the repository at the release tag.
- `src/assets/css/`: tokens, base, layout, components, plus one file per page type (home, store, releases, source, gallery, transitions).
- `src/assets/js/`: one file per behaviour (kinetic, tilt, spotlight, magnetic, progress, journey, carousel, tabs, lightbox, theme, menu, copy).
- `src/assets/img/`: app icon, WeChat QR, `screens/` (small and large version of each screenshot).
- `src/icons/`: one SVG file per icon, inlined with `{{icon:name}}`.
- Live demo (`/demo/` and the home page): `src/partials/demo-*.html` (one file per app screen), `src/assets/css/demo-frame.css` and `demo-app.css`, and `src/assets/js/demo/` (`app.js` state and interactions, `tour.js` scripted tour, `sound.js` Web Audio effects, `main.js` player). Colors, sizes, shield shape and text come from the app's source code (Color.kt, GuardianShield.kt, AppStrings.kt).

## New release checklist
1. Update `src/data/site.json` (version, tag, apkUrl, shaUrl, zipUrl, tarUrl, apkSha, size) and `src/data/releases.json`.
2. Copy the new README.md, CHANGELOG.md, SECURITY.md into `src/content/`, and regenerate `src/data/tree.json` from the tagged source.
3. Replace screenshots in `src/assets/img/screens/` and edit `src/data/screenshots.json`.
4. Run `node build.mjs` and check every page.
