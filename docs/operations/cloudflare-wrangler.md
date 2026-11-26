# Cloudflare operations

All Cloudflare actions are performed locally with your authenticated Wrangler session. GitHub Actions validates and builds; it does not deploy or apply migrations.

## Portfolio Pages and D1

`wrangler.toml` is the Pages configuration source of truth. The existing D1 database is `benitoanagua-portfolio` (`e40020ce-adfb-4c14-b223-0a7b5e3de1b1`); its ID and the `DB` binding are declared there and apply to both preview and production deployments made through Wrangler. Preview and production currently share this single database — this is a known isolation gap. Treat Preview as production data: never run admin writes, destructive statements, ad-hoc seeds, or write-path tests there. Before enabling Preview writes, create a separate D1 database in the same intended Cloudflare account, configure the Pages Preview environment's `DB` binding to that database, apply reviewed migrations, and verify isolation. Do not invent or copy a database ID from another account.

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
pnpm d1:migrations:list
# Compare the output with the files in migrations/ and read them first:
#   migrations/0001_portfolio_content.sql  (schema)
#   migrations/0002_portfolio_seed.sql     (content seed, idempotent upserts)
#   migrations/0003_projects.sql           (projects schema)
#   migrations/0004_projects_seed.sql      (projects seed, idempotent upserts)
# Only proceed if every pending file is reviewed and safe.

# 5. Apply only reviewed pending remote migrations
pnpm d1:migrations:remote

# 6. Build and deploy
pnpm cf:deploy:preview     # preview URL (*.pages.dev preview deployment)
pnpm cf:deploy:production  # production (benitoanagua.pages.dev)

# 7. Verify the deployment
curl -s -o /dev/null -w "%{http_code}\n" https://benitoanagua.pages.dev/
curl -s https://benitoanagua.pages.dev/sitemap.xml | head -5
# Check that public pages render and the sitemap is served as XML
```

Notes:

- `pnpm preview` runs the built output through local Pages emulation with the **local** D1 (`--local`). Remote migrations use `--remote`; local migrations use `pnpm d1:migrations:local`.
- To inspect or seed the local D1 database, use the binding name `DB` (not the database name) so `wrangler pages dev` sees the same local database: `pnpm dlx wrangler@4 d1 execute DB --local --file <file>`.
- The versioned migrations include the current content seed. Do not run an ad-hoc seed/export against the production database. Add schema or seed changes as a new numbered SQL migration in `migrations/` and apply it with `pnpm d1:migrations:remote`.
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

The intended environment topology is defined in [ADR 0005](../adr/0005-environment-and-d1-isolation.md). Current state remains **not isolated**: the Preview and Production deployments use the same D1 resource in the checked-in Wrangler configuration.

Do not consider the environment architecture complete until the Cloudflare account configuration has been verified against all of these items:

- [ ] Dedicated D1 resource created for Preview in the correct Cloudflare account.
- [ ] Pages Preview environment's `DB` binding points to Preview D1.
- [ ] Production environment's `DB` binding points only to Production D1.
- [ ] Reviewed migrations applied separately to both remote databases.
- [ ] Preview write test verified in Preview D1 and absent from Production D1.
- [ ] Production admin path verified against Production D1.
- [ ] Backup/export and recovery procedure recorded before production schema changes.

The repository cannot configure or verify these account-level bindings through source changes alone. Until the checklist is verified in Cloudflare, Preview remains read-only for admin/write testing and must be treated as production data.
