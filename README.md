# Benito Anagua — Skills & Experience

Personal professional site built with SvelteKit, Svelte 5, TypeScript and TOML content, deployed to Cloudflare Pages. Cloudflare infrastructure is managed declaratively through **Wrangler**; `wrangler.toml` is the source of truth for Pages output, environments, D1 bindings and migration paths.

## Routes

- `/` — introduction and entry points
- `/habilidades` — skills grouped by category
- `/habilidades/[slug]` — skill narrative connected to documented roles and responsibilities
- `/experiencia` — professional timeline
- `/cv` — current CV PDFs

## Content model

- `src/lib/data/cv.es.toml` and `cv.en.toml` contain professional experience, education, skill categories and role-specific skill sets.
- `src/lib/data/skill-stories.ts` contains authored narratives for selected skills. Other skills receive a generated narrative from the CV.
- `src/lib/data/site.es.toml` and `site.en.toml` contain localized site metadata and footer content.
- `migrations/` owns the D1 schema and seed migration history. Do not make production schema changes through the dashboard.

## Requirements

Node.js compatible with the Vite version in `package.json`, pnpm, and an authenticated Cloudflare session (`wrangler login`). CI requires the GitHub Actions secret `CLOUDFLARE_API_TOKEN` and the account ID variable `CLOUDFLARE_ACCOUNT_ID`.

## Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm build
pnpm preview
```

`pnpm preview` runs the built Cloudflare output through Wrangler Pages local emulation, rather than Vite's generic preview server.

## Cloudflare / Wrangler operations

`wrangler.toml` is authoritative. The existing D1 database is `benitoanagua-portfolio`; its ID is declared in the configuration and the `DB` binding is included in both Pages environments. Preview and production currently share this database intentionally, so preview code must not perform destructive writes.

```sh
# Authenticate once per workstation
pnpm exec wrangler login

# Inspect Pages project and D1 from the authenticated account
pnpm exec wrangler pages project list
pnpm exec wrangler d1 list

# Apply pending schema/seed migrations (safe to repeat)
pnpm d1:migrations:remote

# Build and publish a preview deployment
pnpm cf:deploy:preview

# Publish to the production branch only when ready
pnpm cf:deploy:production
```

The checked-in migrations are the canonical database history. New schema changes must be added as a new numbered SQL migration and applied using `wrangler d1 migrations apply`. Never recreate the existing D1 database to deploy the application.

## CI/CD

GitHub Actions uses Wrangler for both preview and production deployments. The workflow runs validation before publishing and applies pending D1 migrations before the production deployment. Required GitHub configuration:

- Secret: `CLOUDFLARE_API_TOKEN` with Pages edit and D1 edit permissions for the target account.
- Variable: `CLOUDFLARE_ACCOUNT_ID`.
- The Cloudflare Pages project must be named `benitoanagua`.

Disable the competing Cloudflare Pages Git integration/automatic builds in the Cloudflare dashboard once this workflow is enabled. Otherwise a push could trigger a second deployment outside this pipeline. Wrangler controls deployments and D1 resources; GitHub Actions is only the trigger/runner.

Legacy URLs are redirected in `static/_redirects` to the current skills, experience or CV pages.

## Design system

The shared `PortalLayout` provides navigation, language and theme controls, and the footer. Global tokens and styles live in `src/lib/styles/`.
