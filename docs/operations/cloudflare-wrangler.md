# Cloudflare operations

All Cloudflare actions are performed locally with your authenticated Wrangler session. GitHub Actions validates and builds; it does not deploy or apply migrations.

## Portfolio Pages and D1

## Portfolio Pages and D1

`wrangler.toml` is the Pages configuration source of truth. The existing D1 database is `benitoanagua-portfolio` (`e40020ce-adfb-4c14-b223-0a7b5e3de1b1`); its ID and the `DB` binding are declared there and apply to both preview and production deployments made through Wrangler. Preview and production share this single database — treat it as production data: never run destructive statements or ad-hoc seeds against it. Preview deployments must not perform destructive writes.

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
# Only proceed if every pending file is reviewed and safe.

# 5. Apply pending remote migrations (idempotent; safe to re-run)
pnpm d1:migrations:remote

# 6. Build and deploy
pnpm cf:deploy:preview     # preview URL (*.pages.dev preview deployment)
pnpm cf:deploy:production  # production (benitoanagua.pages.dev)

# 7. Verify the deployment
curl -s https://benitoanagua.pages.dev/ | grep -o 'portfolio-source" content="[^"]*"'
# Check that the response includes the expected `portfolio-source` meta tag
```

Notes:

- `pnpm preview` runs the built output through local Pages emulation with the **local** D1 (`--local`). Remote migrations use `--remote`; local migrations use `pnpm d1:migrations:local`.
- To inspect or seed the local D1 database, use the binding name `DB` (not the database name) so `wrangler pages dev` sees the same local database: `pnpm dlx wrangler@4 d1 execute DB --local --file <file>`.
- The versioned migrations include the current content seed. Do not run an ad-hoc seed/export against the production database. Add schema or seed changes as a new numbered SQL migration in `migrations/` and apply it with `pnpm d1:migrations:remote`.
- Wrangler is invoked through `pnpm dlx wrangler@4`, so no dependency or lockfile change is needed and the major version stays pinned.



## CI

GitHub Actions runs validation only — install, `check`, `lint`, `check:content`, `check:design` and `build`. It holds no Cloudflare credentials and performs no deploys or migrations. See `.github/workflows/ci.yml`.

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
