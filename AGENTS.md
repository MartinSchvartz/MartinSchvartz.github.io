# AGENTS.md

Context for AI coding agents working in this repo. Read this first. Keep it up to date: when a decision changes, update this file in the same change.

## What this is

Martin Schvartz's personal portfolio site, live at https://martinschvartz.github.io. The audience is recruiters and people in tech.

- `/` is the plain site: intro with photo, "What I work on", experience timeline, projects, contact.
- `/play` is an interactive 3D room (a desk in Buenos Aires) built with three.js. It's optional; the plain site always has everything.

## Stack and deploy

- Next.js (App Router) + TypeScript with static export (`output: "export"`). CSS modules plus `app/globals.css`. No UI libraries.
- `/play` uses `three`, `@react-three/fiber` and `@react-three/drei`, loaded only on that page. Keep three.js out of the main page bundle.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml`, which builds `out/` and deploys to GitHub Pages (Pages source: GitHub Actions).

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` (output in `out/`) |
| Serve the build | `python3 -m http.server 4173 -d out` |

Always run `npm run build` and fix errors before committing.

## Where things are

- `lib/content.ts`: all copy (intro, focus areas, about, experience). Edit text here, not in components.
- `lib/projects.ts`: projects list. The section shows an empty state while it's empty. To add a project, add one entry.
- `app/page.tsx` + `app/page.module.css`: the main page.
- `components/Timeline.tsx`: experience timeline (the line draws on scroll, dots fill).
- `components/Interactions.tsx`: scroll reveals (re-run on every route change; see "Known gotchas") and the console greeting.
- `components/CopyEmail.tsx`: copy-email button with the "Copied" check animation.
- `components/play/`: the 3D page. `Play.tsx` is the HTML overlay (topic buttons, info panel, Buenos Aires clock, WebGL fallback), `Scene.tsx` is the three.js scene, `topics.ts` maps desk objects to topics.
- `public/images/martin.jpg`: the portrait (cropped, EXIF/GPS stripped).

## Design rules (from Martin, keep them)

- Must **not** look AI-generated: no gradients, no glassmorphism, no glow effects, no emoji icons, no big gradient hero text.
- Minimal and typographic: Newsreader (serif) for headings, IBM Plex Sans for body, generous whitespace, one accent color, thin dividers.
- Light and dark mode follow the system. Fully responsive (check 375px wide), accessible (focus rings, AA contrast, labels).
- **Motion:** every animation must reveal content, show state, or reward exploration. Only animate `transform` and `opacity`. Reveals under 400ms, run once. Respect `prefers-reduced-motion`.
- **Copy:** plain, direct, first person. No buzzwords. Talk about what Martin builds and how, not a list of employers (those are on LinkedIn).

## Decisions already made (don't re-ask)

- The 2021–2026 employer is shown as **Grux** (the resume says Elate; Martin chose Grux).
- The "press k" accent switcher was removed: it didn't add anything. No easter eggs that only change colors.
- **3D room objects:** robot = AI agents, server rack = backend, monitor = frontend, wall dashboard = reliability, avatar in the chair = About (swivels and waves). The mate is decoration. Clicking the window cycles day/evening/night. The lamp toggles.
- **Avatar** looks like Martin's photo: dark hair, cream jacket over a black T-shirt. Colors are in the `AVATAR` object in `Scene.tsx`. No chain. No framed photo on the wall (both removed as adding nothing).
- **Photos:** always strip EXIF/GPS metadata before committing images.

## How to work with Martin

- **Plan first:** for non-trivial changes, show a short plan and wait for an OK.
- **Ask before pushing** or anything outward-facing.
- **Verify visually:** build, serve `out/`, and screenshot with headless Chrome. WebGL in headless Chrome needs `--enable-unsafe-swiftshader --use-angle=swiftshader`. Command-line `--screenshot` captures the canvas blank, so drive Chrome over the DevTools protocol and wait in real time. Headless windows can't go below 500px wide, so test phone widths with an iframe or device emulation.
- **No AI attribution:** never add `Co-Authored-By` trailers, "Generated with" lines, or any AI credit to commits or pull requests.

## Known gotchas

- The root layout stays mounted during client-side navigation, so anything that scans the DOM on mount must also re-run on route changes (`usePathname`). Otherwise the home page renders blank after returning from `/play`.
- Don't put this repo on the Desktop: it's synced to iCloud, which creates " 2" duplicate files (for example in `.next/`) that break the TypeScript build. The repo lives in `~/code/`.
