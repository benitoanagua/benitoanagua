# Portfolio content in Cloudflare D1

> Architecture and safe-operation notes. This document describes the repository's implementation; it does not certify the live Cloudflare account, Pages bindings or remote migration state. Verify those locally before an operation.

## Scope

D1 stores the portfolio's localized content:

- CV data: profile, education, focus areas, skills and role history.
- Localized site metadata and content.
- Authored skill narratives.
- CV document metadata and public paths.

PDFs and images remain static assets; binary files are not stored in D1. The design system and component catalog are outside this data model.

## Storage

- `portfolio_content` stores validated JSON documents keyed by locale and content type.
- `portfolio_cv_documents` stores public CV metadata and paths.
- `migrations/` contains the versioned schema and seed history. The current migration files are `0001_portfolio_content.sql` and `0002_portfolio_seed.sql`.

The seed exporter reads the localized repository sources:

```sh
pnpm d1:export-portfolio > /tmp/portfolio-seed.sql
```

Review generated SQL before use. Do not edit a migration that has already been applied; add a new numbered migration for subsequent changes.

## Runtime behavior

- `src/lib/server/portfolio-content.ts` performs parameterized reads, validates payloads and falls back to the bundled TOML/TypeScript content if D1 is unavailable.
- `src/routes/+layout.server.ts` resolves the localized payload per request and passes it through page data. There is no global mutable portfolio store.
- The `portfolio-source` meta tag indicates whether the response used `d1` or `fallback`.
- Portfolio routes that require request-time D1 reads are server-rendered. Prerendered project pages use the bundled content fallback; the former `/design-system` route is redirected to the home page.

The localized TOML and TypeScript sources remain in the repository as seed/fallback sources. They are not disposable generated files.

## Safe verification and operation

Preview and production deployments are configured against the same D1 database. Treat it as production data.

Before any remote operation, from the repository root:

```sh
pnpm cf:login       # only if this workstation is not authenticated
pnpm cf:whoami
pnpm d1:list
pnpm d1:migrations:list
```

Confirm the account, database name and pending migrations. Read every pending SQL file before applying it.

- Local development uses the local database and binding `DB`.
- Remote migrations use `pnpm d1:migrations:remote` only after the pending changes have been reviewed and you explicitly intend to update the shared database.
- Never run destructive ad-hoc seeds, deletes or schema changes against the shared database.
- Do not assume a preview branch has an isolated database.

See [Cloudflare and Wrangler operations](cloudflare-wrangler.md) for deployment and authentication procedures.
