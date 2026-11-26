# Portfolio content in Cloudflare D1

> Architecture and safe-operation notes. The remote cutover and migration state were verified on 2026-11-25; see [the completed cutover record](./d1-content-cutover-readiness.md). Resource configuration and current Cloudflare account state must still be verified before changing infrastructure.

## Scope

D1 is the single source of truth for the portfolio's editable public content:

- CV data: profile, education, focus areas, skills and role history.
- Localized site metadata and content.
- Authored skill narratives.
- CV document metadata and public paths.
- Bilingual project records with publication state.

PDFs and images remain static assets in `static/`; binary files are not stored in D1. The design system, component catalog and UI chrome copy (`ui-copy.ts`, `projects-copy.ts`, `nav.ts`) are outside this data model.

## Storage

- `portfolio_content` stores validated JSON documents keyed by locale and content type (`0001_portfolio_content.sql`).
- `portfolio_cv_documents` stores public CV metadata and paths.
- `portfolio_projects` stores bilingual project JSON payloads with `is_published`/`sort_order` (`0003_projects.sql`).
- `0002_portfolio_seed.sql` and `0004_projects_seed.sql` are the committed, idempotent seeds generated from the former TOML sources. They are migration history, not runtime inputs.
- Content is edited through `/admin` and `/admin/proyectos` (Cloudflare Access + JWT validation); there are no TOML sources in runtime anymore.

## Local development

```sh
pnpm install
pnpm d1:migrations:local   # applies schema + seeds to the local D1 database
pnpm check:content         # verifies local D1 integrity (read-only)
pnpm dev                   # vite dev serves pages from the local D1 binding
pnpm build && pnpm preview # production build served by wrangler pages dev
```

Every public page is server-rendered at request time (`prerender = false` in `src/routes/+layout.ts`); nothing is prerendered because the D1 binding only exists in the Cloudflare runtime. If the binding or the data is missing/invalid, loaders throw and the site returns an error instead of silently serving stale content.

## Runtime behavior

- `src/lib/server/portfolio-content.ts` reads `portfolio_content` and `portfolio_cv_documents`, validates payloads and throws on missing binding, query failure or invalid data.
- `src/lib/server/public-projects.ts` reads published `portfolio_projects` rows only; invalid published payloads are hard errors.
- `src/routes/+layout.server.ts` resolves the localized payload and projects per request and passes them through page data. There is no global mutable store and no bundled fallback.
- `/sitemap.xml` is generated at request time from the same D1 loaders (published projects and CV-derived skill pages only).

## Safe verification and operation

Preview and production currently share the same D1 database. This is a known isolation gap, not a desired permanent configuration. Until Preview has its own D1 database binding, treat every Preview deployment as production and do not use it for content editing, destructive operations, or write-path testing. The completed cutover record documents the current shared binding.

Before any remote operation, from the repository root:

```sh
pnpm cf:login       # only if this workstation is not authenticated
pnpm cf:whoami
pnpm d1:list
pnpm d1:migrations:list
```

Confirm the account, database name and pending migrations. Read every pending SQL file before applying it.

- Local development uses the local database and binding `DB`.
- Do not create or configure a Preview database by guessing its ID. Create a separate D1 database in the intended Cloudflare account, bind it to the Pages Preview environment, apply reviewed migrations, and verify Preview reads/writes only that database before enabling Preview administration.
- Remote migrations use `pnpm d1:migrations:remote` only after the pending changes have been reviewed and you explicitly intend to update the shared database. Pending migrations include the seed files, so this step is also the remote content import.
- Back up remote D1 (`wrangler d1 export`) before the first remote apply if no backup exists.
- Never run destructive ad-hoc seeds, deletes or schema changes against the shared database.
- Do not assume a preview branch has an isolated database.

See [Cloudflare and Wrangler operations](cloudflare-wrangler.md) for deployment and authentication procedures.
