# Projects migration to D1

> Completed milestone. The public project loader, project pages, skill links and sitemap all read `portfolio_projects` at request time. The former `projects.{es,en}.toml` sources and the TOML exporter were removed; the bilingual seed is committed as `migrations/0004_projects_seed.sql`.

## Schema and seed

- `0003_projects.sql` creates `portfolio_projects` (slug PK, neutral columns, `content_es`/`content_en` JSON, `is_published`, `sort_order`).
- `0004_projects_seed.sql` is the idempotent bilingual seed generated from the former TOML files. Apply order is handled by `wrangler d1 migrations apply`.

Local setup:

```sh
pnpm d1:migrations:local
pnpm check:content
```

## Runtime behavior

- `src/lib/server/public-projects.ts` selects only `is_published = 1` rows ordered by `sort_order, slug` and validates both localized payloads. Missing binding, query errors or invalid published payloads are hard errors — there is no bundled fallback.
- `/proyectos`, project detail routes, home featured projects, related projects and skill-project cards all consume the layout's D1-backed `projects` data.
- Unpublished records stay in D1 but are invisible publicly: no listing, no detail route (404), no sitemap entry.

## Admin

`/admin/proyectos` (Cloudflare Access protected) supports selecting, creating, updating, publishing/unpublishing and deleting project records. The editor uses JSON for complete project fields so optional fields and link structures are not silently lost. It validates required fields and enforces the shared slug, area, year, stack and skills across languages.

## Remote import (pending, explicit operation)

The remote database is shared by Preview and Production. Before the first remote apply:

1. Back up remote D1 (`wrangler d1 export`).
2. Review pending migrations with `pnpm d1:migrations:list`.
3. Apply explicitly with `pnpm d1:migrations:remote` — this also imports the seeds.
4. Verify counts and that `/proyectos`, a project detail, `/habilidades`, `/cv` and `/sitemap.xml` reflect D1.
