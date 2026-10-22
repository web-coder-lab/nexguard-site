# NEXGUARD website (static, no dependencies)

Build: `node build.mjs` (output in `dist/`). Deploy on Render as a Static Site: build command `node build.mjs`, publish directory `dist` (see `render.yaml`). Set the `SITE_URL` env var to your Render URL to enable canonical links and `sitemap.xml`.

## Structure
- `build.mjs`: page generator. `tools/md.mjs`: Markdown to HTML. `tools/tree.mjs`: source file tree.
- `src/pages/`: one HTML file per page (home, app, download, source, screenshots, features, how-it-works, phones, faq, changelog, security, privacy, terms, license, about, contact, 404).
- `src/templates/`: feature and phone-guide pages, built from data.
- `src/partials/`, `src/layouts/`: header, footer, base layout.
- `src/data/*.json`: all content (site facts, features, phone guides, releases, FAQ, permissions, screenshots, source tree).
- `src/content/*.md`: README, CHANGELOG and SECURITY copied from the repository at the release tag.
- `src/assets/css/`: design tokens, global layout, Apple-like translucent navigation, ambient gradient layers, responsive store/source/release pages, scroll-story phone stage and motion-aware components.
- `src/assets/js/`: small vanilla-JS behaviours (scroll reveal, word-by-word headline reveal, tilt, spotlight, progress, carousel, theme, mobile navigation, clipboard and optional site-wide sound).
- `src/assets/img/`: app icon, WeChat QR, `screens/` (small and large version of each screenshot).
- `src/icons/`: one SVG file per icon, inlined with `{{icon:name}}`.
- Live demo (`/demo/`) and the home page scroll story reuse `src/partials/demo-phone.html` plus the screen partials. The home page uses a lightweight CSS 3D phone stage and `demo/pilot.js` for cancel-safe guided taps. The interactive demo uses `src/assets/js/demo/` (`app.js`, `tour.js`, `main.js`); shared optional Web Audio effects live in `src/assets/js/sound.js`. No Three.js, CDN or runtime framework is required. Colors, sizes, shield shape and text come from the app's source code (Color.kt, GuardianShield.kt, AppStrings.kt).

## New release checklist
1. Update `src/data/site.json` (version, tag, apkUrl, shaUrl, zipUrl, tarUrl, apkSha, size) and `src/data/releases.json`.
2. Copy the new README.md, CHANGELOG.md, SECURITY.md into `src/content/`, and regenerate `src/data/tree.json` from the tagged source.
3. Replace screenshots in `src/assets/img/screens/` and edit `src/data/screenshots.json`.
4. Run `npm run build` and check all internal links and assets. The design respects `prefers-reduced-motion`; keep animation enhancements optional and never claim Play Store/F-Droid availability until official listings are published.
