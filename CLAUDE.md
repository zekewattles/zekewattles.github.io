# zekewattles.github.io

Personal portfolio at **zeke.studio** — Jekyll 3.9 site served natively by GitHub Pages.

Read this file first at the start of a session — it's the source of truth for where we left off.

## Current state (2026-09-28)

**Live and healthy.** Master branch is Jekyll. GitHub Pages source is set to **"Deploy from a branch" → `master` / `/ (root)`** — Pages builds Jekyll natively on every push to master.

- Astro migration attempt (2026-09-19 → 2026-09-23) was **reverted on 2026-09-28** after deploy failures. Full Astro work is preserved on branch `preview/new-homepage` (locally and on origin) in case of future revival.
- Only things on current master that didn't exist pre-migration: `CLAUDE.md` (this file), `.ruby-version` (pins Ruby per-project via rbenv), and an updated `Gemfile.lock`.

## Local dev setup

- **Ruby via rbenv.** `.ruby-version` is committed so `cd` into the project auto-switches to the right Ruby.
- **Bundler 2.2.26** to match the `Gemfile.lock` pin.

```bash
bundle install                          # first time / after Gemfile changes
bundle exec jekyll serve                # dev server at http://localhost:4000
bundle exec jekyll serve --livereload   # auto-refresh browser on save
```

If system Ruby ever gets in the way (permissions on `/Library/Ruby/Gems/`), the fix is rbenv + `gem install bundler:2.2.26` under the rbenv-owned Ruby.

## Editing workflow

Direct commits to master are fine for a personal portfolio — GitHub Pages rebuilds on every push (~30–90s). Use GitHub Desktop or terminal. No PR needed for small tweaks.

**Files worth knowing:**
- `about.html`, `index.html`, `experiments.html` — top-level pages
- `_posts/*.html` — 8 project pages, each with `permalink: /work/<slug>/`
- `_layouts/default.html` — outer HTML shell (calls `_includes/head.html`, navbar, footer, scripts)
- `_layouts/home.html` — home grid (also embeds the "Art + Environment 2021" project)
- `_includes/head.html` — `<head>` metadata
- `_includes/navbar.html`, `_includes/footer.html`, `_includes/scripts.html`
- `_config.yml` — site-wide metadata
- `_sass/styles.scss` — custom dark theme (compiled to `assets/main.css` by Jekyll's Sass; also mirrored in `_site/` because this repo tracks build output)

**Commit noise to expect:** `_site/*` and `.sass-cache/*` regenerate on every local `jekyll serve`. The pre-migration repo tracks them (unusual choice, but pre-existing), so commits will look bulky — GitHub Pages ignores them and rebuilds server-side.

## Domain / DNS

- **Registered at Squarespace Domains** (migrated from Google Domains in 2023). Login: https://account.squarespace.com.
- **Apex**: `zeke.studio` → GitHub Pages via A records at DNS + `CNAME` file containing `zeke.studio`.
- **www**: `www.zeke.studio` CNAME → `zekewattles.github.io` (added 2026-09-28, redirects to apex via GitHub Pages).
- **HTTPS**: enforced by GitHub Pages.

## Site metadata reference

**Site-wide (`_config.yml`):**
- `title: Zeke Wattles`
- `email: zeke@zeke.studio`
- `description: Zeke Wattles / Graphic Design`
- `url: "zeke.studio"` — note: missing `https://` scheme. Not causing visible problems, but technically invalid; worth fixing eventually.

**About page (`about.html`) frontmatter:**
- `title: About`
- `description: Zeke Wattles - Graphic Designer` — note: **not wired up** in `_includes/head.html`; page falls back to `site.description`.

**Head template (`_includes/head.html`):**
- `<title>` = `{{ page.title }} - {{ site.title }}` (or just site title on home).
- `<meta name="description">` = `page.excerpt` if present, else `site.description`, truncated to 160 chars.
- Full favicon / touch icon set from `/img/site/`.
- RSS feed at `/feed.xml`.
- **No** Open Graph tags, Twitter cards, or per-page description wiring.

## Recent session (2026-09-28)

1. Reverted Astro migration (commit `5cf3841` on master) — single revert commit snapshotting pre-migration tree `a945910`. `preview/new-homepage` branch untouched.
2. Cleaned up local Astro artifacts (`node_modules/`, `dist/`, `.astro/`, `public/`) — ~640MB, all rebuildable.
3. Zeke flipped GitHub Pages source from "GitHub Actions" back to "Deploy from a branch".
4. Set up local Jekyll dev (rbenv + Ruby, bundler 2.2.26).
5. About page edits: added mailto subject line — `mailto:zeke@zeke.studio?subject=Work%20samples%20please%20%3A%29` — and a new image `img/about/figma_preview-small.jpg`.
6. Added `www.zeke.studio` CNAME record in Squarespace DNS.

## Ideas parked for later

- Fix `_config.yml` `url` to include `https://` scheme.
- Wire up per-page `description:` frontmatter in `_includes/head.html` (currently the field exists on about.html but isn't rendered).
- Add Open Graph tags to `_includes/head.html` for better link previews (Slack, iMessage, LinkedIn).
- Consider adding `.gitignore` for `_site/` and `.sass-cache/` to reduce commit noise — would be a departure from the pre-migration convention but cleaner going forward.

---

## Historical: Astro migration (2026-09-19 → 2026-09-28, reverted)

An Astro migration was attempted, completed locally through Stage 7, deployed to production, then failed in CI (Node/npm version issues) and was reverted. The full migration plan, decisions, and implementation notes live on branch `preview/new-homepage`. Key artifacts if you ever want to revisit:

- Migration branch: `preview/new-homepage` (both local and origin).
- Migration plan: the previous version of this file, recoverable via `git show 90a22fd:CLAUDE.md`.
- Astro-era commits on master (all pre-revert): `82f9fad`, `80f9ea0`, `b5cf823`, `e23bf94`.

**Why it was reverted:** GitHub Actions deploy kept failing (Node 20 → 22 bump, then `npm ci` "Exit handler never called" crash). Fixes were attempted but the site stayed down. Rolling back to the well-understood Jekyll setup was faster than continuing to debug CI.

**If resuming the migration**: check out `preview/new-homepage`, read its version of CLAUDE.md, and pick up from Stage 8 (cutover cleanup). The main unresolved problem is CI — the local `npm run build` worked fine.

## Pre-migration audit (still current — describes today's site)

- **Stack**: Jekyll 3.9, Bootstrap 4.3, jQuery 3.3, FontAwesome 4.7, gulp (all ~7 years old).
- **Theme**: Vendored Start Bootstrap "Clean Blog" 5.0.4.
- **Deploy**: GitHub Pages builds Jekyll natively; `CNAME` = `zeke.studio`.
- **Pages**: `index.html` (home grid), `about.html`, `experiments.html`, `resume.html` (mostly commented out), `posts/index.html` (unused theme leftover).
- **Content**: 8 projects in `_posts/*.html` with `permalink: /work/<slug>/`. Bodies are 100–780 lines of hand-crafted Bootstrap grid HTML. Metadata (category/team/year/instructor) is prose, not frontmatter.
- **Two "orphan" projects live in templates, not `_posts/`**:
  - "Art + Environment 2021" (hardcoded in `_layouts/home.html`)
  - "Kinetic Type" (hardcoded in `experiments.html`)
- **Images**: `img/` is 448MB, 297 files (Karaoke alone is 168MB, Deepfakes 89MB). 35 mp4, 22 gif. Unoptimized.
- **Fonts**: `fonts/` has 12 woff/woff2 files (Graphik, Styrene B, Real Text) — none are `@font-face`'d anywhere. Orphaned.
- **Dead code**: Formspree contact-form JS in `_includes/scripts.html` (no contact page exists), `_includes/read_time.html` (unreferenced), `resume.html` (95% commented out), `assets/vendor/` (19MB third-party).

### The 8 project URLs (must preserve)

- `/work/formosa/` — Type design (2019)
- `/work/chill_by_netflix/` — Packaging (2019)
- `/work/the_blade/` — Interactive installation (2019)
- `/work/how_to_deepfake_yourself/` — Book design (2019)
- `/work/deepfake_karaoke/` — Service/installation (2019, 780-line body — largest)
- `/work/order_and_chaos/` — Interactive installation (2019)
- `/work/ascii-booth/` — Creative tech (2019) — note frontmatter date `2019-01-25` disagrees with filename `2019-01-28`
- `/work/dublab/` — Identity system (2019)
