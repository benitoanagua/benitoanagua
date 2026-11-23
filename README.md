# Benito Anagua — Skills & Experience

Personal professional site built with SvelteKit, Svelte 5, TypeScript and TOML content, deployed as a static site to Cloudflare Pages. The current information architecture centers on **skills**, **professional experience**, and **CV documents**. Project case studies can be added later without changing this foundation.

## Routes

- `/` — introduction and entry points
- `/habilidades` — skills grouped by category
- `/habilidades/[slug]` — skill narrative connected to documented roles and responsibilities
- `/experiencia` — professional timeline
- `/cv` — current CV PDFs

## Content model

- `src/lib/data/cv.es.toml` and `cv.en.toml` contain professional experience, education, skill categories and role-specific skill sets.
- `src/lib/data/skill-stories.ts` contains authored narratives for selected skills. Other skills receive a generated narrative from the CV, with direct textual evidence distinguished from related professional context.
- `src/lib/data/site.es.toml` and `site.en.toml` contain localized site metadata and footer content.
- `SKILLS_CONTENT_GUIDE.md` explains how to add and maintain skill stories.

## Development

Requirements: Node.js compatible with the Vite version in `package.json` and pnpm.

```sh
pnpm install
pnpm run dev
pnpm run check
pnpm run lint
pnpm run build
pnpm run preview
```

`pnpm run build` first runs `scripts/generate-static.ts`, which updates `static/robots.txt`, `static/sitemap.xml` and `static/manifest.json`, then runs the SvelteKit build.

## Deployment

Cloudflare Pages uses the repository's configured build output in `wrangler.toml`. Pushing to the connected production branch triggers the deployment. Legacy URLs are redirected in `static/_redirects` to the current skills, experience or CV pages.

## Design system

The shared `PortalLayout` provides navigation, language and theme controls, and the footer. Global tokens and styles live in `src/lib/styles/`.
