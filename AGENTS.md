# AGENTS.md

Context for AI coding agents working in this repo. Read this first. Keep it up to date: when a decision changes, update this file in the same change.

## What this is

Martin Schvartz's personal portfolio site, live at https://martinschvartz.com. The audience is recruiters and people in tech.

One page (`/`): hero with the big name and photo, stats row, "used at" names, Selected work (FORM, then Mercado Libre projects with drawn thumbnails), What I work on, Experience timeline, Contact band.

## Stack and deploy

- Next.js (App Router) + TypeScript with static export (`output: "export"`). CSS modules plus `app/globals.css`. No UI libraries.
- **Deploy:** hosted on Cloudflare Workers (static assets). Workers Builds is connected to the GitHub repo: every push to `main` runs `npm run build` then `npx wrangler deploy`, which uploads `out/` (config in `wrangler.jsonc`; the `name` must match the Worker in the dashboard, `martinschvartz-github-io`). Custom domain `martinschvartz.com`, bought on Cloudflare Registrar.
- **Old URL:** `.github/workflows/deploy.yml` still deploys to GitHub Pages, but only `github-pages/` (a redirect page served as `index.html` and `404.html`), so `martinschvartz.github.io/...` forwards to `martinschvartz.com/...`.
- **Email:** the site shows `hi@martinschvartz.com`. Cloudflare Email Routing forwards it to Martin's Gmail (receive only; catch-all is off).

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` (output in `out/`) |
| Serve the build | `python3 -m http.server 4173 -d out` |

Always run `npm run build` and fix errors before committing.

## Where things are

- `lib/content.ts`: all copy (headline, intro, stats, focus areas, about, experience). Edit text here, not in components.
- `lib/projects.ts`: Selected work, grouped by company (`form`, `meli`). Each project picks a drawn thumbnail by id.
- `components/Thumb.tsx` + `Thumb.module.css`: the project thumbnails, drawn in HTML/CSS (no logos or screenshots). Sizes use `cqw` container units; keep padding off the `.thumb` container itself or `cqw` shrinks.
- `app/page.tsx` + `app/page.module.css`: the main page.
- `components/ClientLogo.tsx`: FORM client logos (files in `public/logos/`, from Wikimedia Commons and Simple Icons). Gray at rest; a color copy fades in on hover with a name tooltip. Flowers Foods has no clean logo file, so it's a wordmark.
- `components/LinkedInCard.tsx`: LinkedIn profile card in the Contact band. Built in-house because LinkedIn's official badge script often renders blank (login wall).
- `components/Timeline.tsx`: experience timeline (the line draws on scroll, dots fill).
- `components/Interactions.tsx`: scroll reveals and the console greeting.
- `components/CopyEmail.tsx`: copy-email button with the "Copied" check animation.
- `public/images/martin.jpg`: the portrait (472px square headshot, EXIF/GPS stripped).

## Design rules (from Martin, keep them)

- Must **not** look AI-generated: no gradients, no glassmorphism, no glow effects, no emoji icons, no big gradient hero text.
- Typographic: Geist for everything (bold, tight tracking on headings), Geist Mono for small labels. Warm off-white background (`#f5f4f0`), black accent with warm gray (`#8c8a84`) as the second tone, solid gray and black bands (no gradients). Color comes from the brand-colored project thumbnails. Martin rejected Newsreader/IBM Plex and the cobalt accent. The name is set very large in the hero so recruiters remember it.
- Light only (Martin didn't like the black dark mode). Fully responsive (check 375px wide), accessible (focus rings, AA contrast, labels).
- **Motion:** every animation must reveal content, show state, or reward exploration. Only animate `transform` and `opacity`. Scroll reveals: 24px rise, 600ms fade / 800ms move on `--ease-reveal` (Martin found shorter ones "popped"), staggered 90ms, run once. Respect `prefers-reduced-motion`.
- **Copy:** plain, direct, first person. No buzzwords. Talk about what Martin builds and how, not a list of employers (those are on LinkedIn).

## Decisions already made (don't re-ask)

- Timeline (years only): Kovix 2018–2021, Mercado Libre 2021–2025, Grux 2025–2026, FORM 2026–Present. Siran is not shown. Grux is the name Martin chose (the resume says Elate).
- The hero says "8+ years", never "since 2018".
- Education: Martin studies Computer Engineering at UADE, but the site says only "studying Computer Science" (clearer for US recruiters). Don't name the university.
- Selected work: FORM (name customers like PepsiCo, AB InBev, Kroger) and Mercado Libre (Meli+, address input, Delivery Day / "Tu día de entregas"). Until Martin has personal projects, this is the projects section.
- The 3D `/play` page was removed: Martin didn't like it and nobody would see it. Don't bring it back.
- Every link that leaves the site opens in a new tab (`target="_blank" rel="noopener noreferrer"`). In-page anchors and `mailto:` don't.
- The "press k" accent switcher was removed: it didn't add anything. No easter eggs that only change colors.
- **Photos:** always strip EXIF/GPS metadata before committing images.

## How to work with Martin

- **Plan first:** for non-trivial changes, show a short plan and wait for an OK.
- **Ask before pushing** or anything outward-facing.
- **Verify visually:** build, serve `out/`, and screenshot with headless Chrome. Drive Chrome over the DevTools protocol and scroll the page first so the reveals run. Headless windows can't go below 500px wide, so test phone widths with device emulation.
- **No AI attribution:** never add `Co-Authored-By` trailers, "Generated with" lines, or any AI credit to commits or pull requests.

## Known gotchas

- The root layout stays mounted during client-side navigation, so anything that scans the DOM on mount must also re-run on route changes (`usePathname`).
- After deleting a route, clear `.next/` before building, or stale generated types break the type check.
- Don't put this repo on the Desktop: it's synced to iCloud, which creates " 2" duplicate files (for example in `.next/`) that break the TypeScript build. The repo lives in `~/code/`.
