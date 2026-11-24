# ADR 0001 — Projects as a separate evidence layer

Status: accepted · 2026-11-23

## Context

The site is organized around skills (`/habilidades`) and experience (`/experiencia`), both generated from `cv.*.toml`. `SKILLS_CONTENT_GUIDE.md` already states that project pages can be added later without changing that model. The CVs mention independent projects without names, links or screenshots, so skills lacked concrete evidence beyond job descriptions.

## Decision

- Add `/proyectos` and `/proyectos/<slug>`, fed by `projects.{es,en}.toml`. They do not modify `cv.*.toml` or `skill-profiles.ts`.
- Link projects ↔ skills by slug (`slugify`, the same convention as `skill-profiles.ts`); the skill page shows the projects that apply it.
- Keep one TOML per language and a validation script instead of a CMS or markdown pipeline: it matches the existing content layer and needs no new dependencies.
- Centralize the main navigation in `src/lib/data/nav.ts` (it was duplicated in five pages) and add a mobile nav strip, because the toolbar nav is hidden below 1024px.
- Areas (`dev`, `design`, `graphic`, `analysis`, `games`) are a fixed list; labels live in `projects-copy.ts`.

## Consequences

- Adding a project is a single TOML block per language; links on skill pages appear automatically.
- Project skills without a CV skill have no page; `check:content` lists them.
- Project text is not auto-translated: both files must be kept in sync (the validator checks structure, not wording).

## Also fixed in this change

- `habilidades/+page.svelte`: unclosed `)` in the tablet media query.
- `config.ts`: GitHub handle (`benito-anagua` → `benitoanagua`, as in the CVs).
- `app.html`: removed the fixed `canonical` and `hreflang` links to non-existent `/en` and `/es` (they conflicted with per-page canonicals).
- JSON-LD in the root layout and the home page was emitted un-interpolated (invalid JSON); now built with `JSON.stringify`.
