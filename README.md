# Benito Anagua — Portfolio

Personal portfolio built with SvelteKit, Svelte 5 and TypeScript. The site presents professional skills and experience with project evidence, in Spanish and English.

## Deliverables

- **Portfolio:** main SvelteKit application, deployed to Cloudflare Pages.
- **FOLIO design system:** reusable Svelte 5 components, published as `@benitoanagua/folio` from `packages/folio`.
- **FOLIO Catalog:** standalone Svelte/Vite component reference in `apps/catalog`, deployed to a separate Pages project.

## Development

Requirements: Node.js compatible with the Vite version in `package.json` and pnpm.

```sh
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm build
pnpm preview
```

Build all deliverables with `pnpm build:all`.

## Documentation

- [Documentation index](docs/README.md)
- [Cloudflare and Wrangler operations](docs/operations/cloudflare-wrangler.md)
- [D1 content migration notes](docs/operations/d1-content-migration.md)
- [FOLIO reading constitution](docs/design/constitucion-lectura.md)
- [Portfolio UI/UX specification](docs/design/portfolio-ui-ux.md)
- [Skills and experience content guide](docs/content/skills-and-experience.md)
- [Project content review queue](docs/review/projects-content-review.md)
- [Architecture decisions](docs/adr/)

## Content and data

Portfolio content is maintained in localized TOML files under `src/lib/data/`. D1 schema and migration history live in `migrations/`; review the migration files and current remote state before applying changes. Do not store credentials, customer data or production records in the repository.
