# Benito Anagua — Skills & Experience

Personal professional site built with SvelteKit, Svelte 5, TypeScript and TOML content, deployed to Cloudflare Pages. Cloudflare infrastructure is managed declaratively through **Wrangler**; `wrangler.toml` is the source of truth for Pages output and D1 bindings.

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
- `migrations/` owns D1 schema and seed history. Do not make production schema changes through the dashboard.

## Requirements

Node.js compatible with the Vite version in `package.json`, pnpm, and an authenticated Cloudflare session (`wrangler login`). CI requires the GitHub Actions secret `CLOUDFLARE_API_TOKEN` and variable `CLOUDFLARE_ACCOUNT_ID`.

## Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm build
pnpm preview
```

`pnpm preview` runs the built Cloudflare output through Wrangler Pages local emulation.

## Cloudflare / Wrangler operations

`wrangler.toml` is the Pages configuration source of truth. The existing D1 database is `benitoanagua-portfolio`; its ID and the `DB` binding are declared there. Preview and production currently share this database, matching the verified remote configuration. Preview deployments must not perform destructive writes. Cloudflare Pages uses only its supported `preview` and `production` configuration environments; branch names such as `pr-123` select preview deployment URLs, not separate Wrangler environments.

```sh
# Authenticate once per workstation
pnpm exec wrangler login

# Inspect Pages projects and D1 resources
pnpm exec wrangler pages project list
pnpm exec wrangler d1 list

# Apply only pending, versioned migrations
pnpm d1:migrations:remote

# Deploy preview or production explicitly
pnpm cf:deploy:preview
pnpm cf:deploy:production
```

The versioned migrations include the current content seed. Do not run an ad-hoc seed/export against the production database during deployment. Add schema or seed changes as a new numbered SQL migration and apply it with Wrangler.

## CI/CD

GitHub Actions runs validation, then calls Wrangler for preview deploys from pull requests and production deploys from `main`. Production migrations run before the production deploy. Configure:

- GitHub secret `CLOUDFLARE_API_TOKEN` with Pages write and D1 edit permissions.
- GitHub variable `CLOUDFLARE_ACCOUNT_ID`.
- The Pages project named `benitoanagua`.

Turn off the competing Cloudflare Pages Git build integration in the Cloudflare dashboard after verifying this workflow. Otherwise pushes can trigger a second deployment outside the controlled Wrangler pipeline. Wrangler owns Cloudflare configuration and deploy operations; GitHub Actions is only the runner.

Legacy URLs are redirected in `static/_redirects` to current skills, experience or CV pages.

## Design system

The shared `PortalLayout` provides navigation, language and theme controls, and the footer. Global tokens and styles live in `src/lib/styles/`.
