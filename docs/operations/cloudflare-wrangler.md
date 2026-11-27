# Cloudflare operations

Wrangler deploys and D1 commands run locally with your authenticated session. Pages environment bindings are managed in the Cloudflare Pages deployment configuration. GitHub Actions validates and builds; it does not deploy or apply migrations.

## Portfolio Pages and D1

`wrangler.toml` declares the Production `DB` binding and a separate `DB_PREVIEW` binding for local administration. The effective deployed Preview `DB` binding is configured in Cloudflare Pages. Two independent D1 databases are used:

| Environment | Database name                    | Database ID                            | `DB` binding       |
| ----------- | -------------------------------- | -------------------------------------- | ------------------ |
| Production  | `benitoanagua-portfolio`         | `e40020ce-adfb-4c14-b223-0a7b5e3de1b1` | Production D1 only |
| Preview     | `benitoanagua-portfolio-preview` | `e35162cf-6599-4b2e-b1f9-ae4099382a4b` | Preview D1 only    |

`wrangler.toml` declares the bindings used by local development (`wrangler pages dev`, `vite dev` and `wrangler d1` local commands): `DB` points to the production-named database and `DB_PREVIEW` to the Preview-named one. A binding name maps to a single resource within a binding set, so the second database needs a distinct name — that is why `DB_PREVIEW` exists.

Deployed environments are configured separately: each Pages environment (Preview, Production) has its own binding set managed in the Cloudflare Pages project settings (Settings → Bindings, backed by the deployment configuration API). The Preview `DB` binding there points to `benitoanagua-portfolio-preview`; the Production `DB` binding points to `benitoanagua-portfolio`. This separation is an architectural decision recorded in [ADR 0005](../adr/0005-environment-and-d1-isolation.md), not a Wrangler limitation.

All Cloudflare operations run from your local machine with your own Wrangler login. GitHub Actions never touches Cloudflare.

### Local Cloudflare procedure

Run these steps from a terminal in the repository root:

```sh
# 1. Authenticate Wrangler (opens a browser; one-time per workstation)
pnpm cf:login

# 2. Verify the authenticated account
pnpm cf:whoami

# 3. Confirm the expected resources exist
pnpm cf:pages:list     # Pages project "benitoanagua"
pnpm d1:list           # D1 database "benitoanagua-portfolio"

# 4. Review pending D1 migrations before applying anything
pnpm d1:migrations:list:production
# For Preview, use: pnpm d1:migrations:list:preview
# Compare the output with the files in migrations/ and read them first:
#   migrations/0001_portfolio_content.sql  (schema)
#   migrations/0002_portfolio_seed.sql     (content seed, idempotent upserts)
#   migrations/0003_projects.sql           (projects schema)
#   migrations/0004_projects_seed.sql      (projects seed, idempotent upserts)
# Only proceed if every pending file is reviewed and safe.

# 5. Apply only reviewed pending remote migrations
pnpm d1:migrations:production
# Preview, only when intentionally updating Preview:
# pnpm d1:migrations:preview

# 6. Build and deploy
pnpm cf:deploy:preview     # preview URL (*.pages.dev preview deployment)
pnpm cf:deploy:production  # production (benitoanagua.pages.dev)

# 7. Verify the deployment
curl -s -o /dev/null -w "%{http_code}\n" https://benitoanagua.pages.dev/
curl -s https://benitoanagua.pages.dev/sitemap.xml | head -5
# Check that public pages render and the sitemap is served as XML
```

Notes:

- `pnpm preview` runs `wrangler pages dev .svelte-kit/cloudflare`. Pages Dev executes locally by default and emulates bindings against local D1 — no `--local` flag is required (the flag is deprecated and hidden in current Wrangler; remote bindings require explicit opt-in). `wrangler d1 migrations apply` and `wrangler d1 execute` default to remote and need `--local` for the local database; `pnpm d1:migrations:local` applies the migrations locally.
- To inspect or seed the local D1 database, use the binding name `DB` (not the database name) so `wrangler pages dev` sees the same local database: `pnpm dlx wrangler@4 d1 execute DB --local --file <file>`.
- The versioned migrations include the current content seed. Do not run an ad-hoc seed/export against the production database. Add schema or seed changes as a new numbered SQL migration in `migrations/` and apply it with `pnpm d1:migrations:production` for Production or `pnpm d1:migrations:preview` for Preview.
- Wrangler is invoked through `pnpm dlx wrangler@4`, so no dependency or lockfile change is needed and the major version stays pinned.

## CI

GitHub Actions runs validation only — install, local D1 migrations, `check`, `lint`, `test`, `check:content`, `check:design` and `build`, plus the Playwright suite against a locally seeded D1. It holds no Cloudflare credentials and performs no deploys or remote migrations. See `.github/workflows/ci.yml`.

If the Cloudflare Pages Git integration is enabled for this project, pushes to `main` will still trigger a Pages-side production build outside this pipeline. To keep deploys fully under local control, disable the Git integration in the Cloudflare dashboard (Pages project → Settings → Builds) and deploy with `pnpm cf:deploy:production`.

Legacy URLs are redirected in `static/_redirects` to current skills, experience or CV pages.

## FOLIO catalog deployment

The component catalog is a separate Pages project and has no D1 binding.

```sh
pnpm catalog:build
pnpm catalog:pages:create # only once, if the project does not exist
pnpm catalog:deploy
```

The catalog deploy command uses `apps/catalog/wrangler.toml` and the Pages project `benitoanagua-design-system`. Confirm the target project and branch before deploying.

## Target environment verification checklist

The intended environment topology is defined in [ADR 0005](../adr/0005-environment-and-d1-isolation.md). The checklist below reflects the **verified current state**.

- [x] Dedicated D1 resource created for Preview in the correct Cloudflare account: `benitoanagua-portfolio-preview` (`e35162cf-6599-4b2e-b1f9-ae4099382a4b`, region ENAM).
- [x] Pages Preview environment's `DB` binding points to Preview D1 (`e35162cf-6599-4b2e-b1f9-ae4099382a4b`). Configured via Cloudflare API `PATCH /accounts/{account_id}/pages/projects/benitoanagua/deployment-configs`.
- [x] Production environment's `DB` binding points only to Production D1 (`e40020ce-adfb-4c14-b223-0a7b5e3de1b1`). Unchanged.
- [x] Reviewed migrations applied separately to both remote databases: all 4 migrations (0001–0004) applied to Preview; Production was already up to date.
- [x] Preview write test verified in Preview D1 and absent from Production D1. Test record `preview-isolation-test-2026-11-26` written to Preview on 2026-11-26, confirmed present in Preview and absent from Production, then removed from Preview.
- [x] Production admin path verified against Production D1: Production binding unchanged, data untouched.
- [x] Backup/export and recovery procedure documented in [D1 content operations](d1-content-migration.md).
- [ ] A fresh Production backup artifact is exported and stored outside the repository before the next schema change.

### Verifying bindings in Cloudflare Pages

```sh
# List D1 databases in the account
pnpm dlx wrangler@4 d1 list

# Inspect the effective Pages deployment configuration (requires authenticated wrangler session)
# The d1_databases.DB.id per environment is visible in the Pages dashboard under
# Project benitoanagua → Settings → Environments → Preview / Production.
```

### Applying migrations by environment

Migrations live in `migrations/` (0001–0004). They are idempotent and must be applied independently to each D1.

```sh
# Production (review first, never run destructive migrations without backup)
pnpm dlx wrangler@4 d1 migrations apply benitoanagua-portfolio --remote

# Preview (independent database, safe to initialize from scratch)
pnpm dlx wrangler@4 d1 migrations apply benitoanagua-portfolio-preview --remote

# Local development (uses the production-named local D1)
pnpm d1:migrations:local
```

### Backup before schema changes

Before applying any migration to Production, export the current database:

```sh
pnpm dlx wrangler@4 d1 export benitoanagua-portfolio --remote --output backup-production-$(date +%F).sql
```

Store the backup outside the repository. Never run destructive migrations on Production without a confirmed backup. Never write test records to Production.

### Isolation test result

**Date:** 2026-11-26
**Method:** `wrangler d1 execute` INSERT of record `preview-isolation-test-2026-11-26` into Preview D1 (`e35162cf-...`), then SELECT on both Preview and Production.
**Result:** Record present in Preview, absent from Production. Record removed from Preview afterward. **Isolation confirmed.**
