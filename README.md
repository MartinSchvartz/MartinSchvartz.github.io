# martinschvartz.github.io

Personal site. Next.js (App Router) with static export, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # static output in out/
```

Content lives in `lib/content.ts`. To add a project, append an entry to `lib/projects.ts`.
