# Benito Anagua — Portfolio, FOLIO and Catalog

This repository delivers three distinct artifacts from one source tree:

1. **Portfolio** — SvelteKit site deployed to Cloudflare Pages project `benitoanagua`.
2. **FOLIO** — Svelte 5 design system published to npm as `@benitoanagua/folio`.
3. **FOLIO Catalog** — standalone Svelte + Vite component reference, deployed to its own Cloudflare Pages project `benitoanagua-design-system`.

The design-system source is canonical in `packages/folio/src/lib`. The portfolio and catalog consume that source through the `$folio` alias; the npm artifact is built from the same source.

## Repository map

- `src/` — portfolio application and professional content.
- `packages/folio/` — npm package source, exports, tokens and styles.
- `apps/catalog/` — independent Svelte component catalog.
- `migrations/` — append-only D1 schema/content migrations.
- `docs/adr/` — architectural decisions.
- `CONTENIDO_PENDIENTE.md` — editorial items awaiting owner confirmation; not runtime content.

## Local development

```sh
pnpm install
pnpm dev
pnpm catalog:dev
pnpm check
pnpm lint
pnpm check:content
pnpm check:design
pnpm build:all
pnpm preview
```

## Artifact 1 — Portfolio

The site uses SvelteKit, Svelte 5, TypeScript and localized TOML content. D1 is the runtime source where available; bundled TOML is the validated fallback.

`wrangler.toml` owns the portfolio Pages configuration and D1 binding. The existing database is `benitoanagua-portfolio` (`e40020ce-adfb-4c14-b223-0a7b5e3de1b1`). Preview and production share this database: treat it as production data.

All Cloudflare operations run locally through Wrangler. GitHub Actions validates code only and has no Cloudflare credentials.

```sh
pnpm cf:login
pnpm cf:whoami
pnpm cf:pages:list
pnpm d1:list
pnpm d1:migrations:list
# Review each pending SQL migration before applying:
pnpm d1:migrations:remote
pnpm cf:deploy:preview
pnpm cf:deploy:production
```

Disable Cloudflare Pages Git auto-deploy for the portfolio project if local Wrangler deploys must be the sole deployment path.

## Artifact 2 — npm package

Package: `@benitoanagua/folio`

```sh
pnpm folio:build
cd packages/folio
npm pack
npm login
npm publish --access public
```

Inspect the tarball before publishing. Confirm the npm scope/name is available and bump `packages/folio/package.json` for each release. Svelte 5 is a peer dependency. Do not publish from CI or commit npm credentials.

Consumer usage:

```svelte
<script>
  import { Button, Card } from '@benitoanagua/folio';
  import '@benitoanagua/folio/styles.css';
</script>
<Card title="Example"><Button>Action</Button></Card>
```

## Artifact 3 — Svelte catalog

The catalog is a separate Vite application in `apps/catalog`, not a mock route inside the portfolio.

```sh
pnpm catalog:dev
pnpm catalog:build
pnpm catalog:pages:create
pnpm catalog:deploy
```

Create its Pages project once from your local authenticated session. The catalog has its own Pages project and no D1 binding.

## Content and data safety

- Never publish client data, production records, internal screenshots or credentials.
- Do not invent project metrics, clients or outcomes.
- `CONTENIDO_PENDIENTE.md` is an editorial review list; it is retained until those questions are resolved.
- D1 changes are versioned under `migrations/`; do not seed or mutate production data ad hoc.

## CI

GitHub Actions runs static validation, content/design checks and builds the portfolio, npm package and catalog. It does not authenticate to Cloudflare, run D1 migrations or deploy.
