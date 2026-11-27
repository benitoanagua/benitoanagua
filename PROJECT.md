# Portfolio — Project Guide

This document is the technical entry point for the repository. The profile-facing [README.md](./README.md) is intentionally concise; this guide describes the application, related work, development workflow, and documentation.

## Overview

This repository contains a personal portfolio built with **SvelteKit, Svelte 5, and TypeScript**. It presents professional skills and experience with project evidence, in Spanish and English.

The portfolio is published at [benitoanagua.pages.dev](https://benitoanagua.pages.dev/).

The repository is organized as a pnpm workspace with these deliverables:

| Deliverable   | Description                                   | Location / status                              |
| ------------- | --------------------------------------------- | ---------------------------------------------- |
| Portfolio     | Main SvelteKit application                    | Repository root; published on Cloudflare Pages |
| FOLIO         | Reusable Svelte 5 reading-first design system | `packages/folio`; release prepared, publication status to verify |
| FOLIO Catalog | Standalone Svelte/Vite component reference    | `apps/catalog`; deployed, live smoke test to verify |

## Target architecture

The portfolio is a **modular monolith**: SvelteKit routes and server load functions deliver the application, while server-side modules own domain rules, validation and D1 access. The browser receives validated page data and does not access D1 directly.

- **Content domains:** portfolio content, CV/experience, projects, administration, validation and SEO.
- **Persistence:** Cloudflare D1 is the source of truth for editable structured content; static assets hold binary files.
- **FOLIO:** an independent workspace package; the portfolio may depend on it, but FOLIO must not import portfolio application code.
- **Catalog:** a separate Vite application with independent deployment and no portfolio D1 binding.
- **Environments:** local D1, dedicated Preview D1 and Production D1. Preview and Production use separate D1 databases; the isolation write test was verified on 2026-11-26.
- **Delivery:** CI validates only. Production deploys, remote migrations and package releases are deliberate operator actions.

The accepted decisions are recorded in [ADRs 0004–0006](docs/README.md#architecture-decisions). See the Cloudflare operations guide for the current isolation status and verification procedure.

## Current operational follow-up

- Cloudflare Preview and Production D1 are isolated; the controlled isolation test is documented in the Cloudflare operations guide.
- Catalog deployment is complete; verify the live URL after edge/DNS propagation.
- FOLIO `0.1.0` has passed package and isolated-consumer checks; verify registry state and publish only with npm authentication.
- GitHub branch protection for `main` remains disabled and requires repository settings.
- Export and store a Production D1 backup outside the repository before the next schema migration.

## Technology

- SvelteKit and Svelte 5
- TypeScript
- Vite
- pnpm workspaces
- Cloudflare Pages for deployment
- Cloudflare D1 for portfolio content storage and migrations
- Playwright for end-to-end testing
- Prettier and ESLint for formatting and linting

## Repository structure

```text
.
├── apps/
│   └── catalog/          # FOLIO component catalog (deployed separately)
├── docs/
│   ├── adr/              # Architecture decision records
│   ├── content/          # Content authoring guidance
│   ├── design/           # Design principles and specifications
│   ├── operations/       # Deployment and data operations
│   └── review/           # Editorial review notes
├── e2e/                  # Playwright end-to-end tests
├── migrations/            # Cloudflare D1 migrations
├── packages/
│   └── folio/            # FOLIO component library (release prepared; npm publication requires registry auth)
├── scripts/               # Validation and generation scripts
├── src/                   # Portfolio application source
├── static/                 # Static assets
├── README.md               # Concise GitHub profile introduction
└── PROJECT.md              # This technical project guide
```

## Requirements

- Node.js 20 or newer (required by the FOLIO package; use a version compatible with the installed Vite toolchain).
- pnpm.

## Getting started

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Run the main quality checks:

```sh
pnpm check
pnpm lint
pnpm build
```

Build all deliverables:

```sh
pnpm build:all
```

## Available scripts

### Application and quality

| Command          | Purpose                                                                       |
| ---------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`       | Start the portfolio development server                                        |
| `pnpm check`     | Run Svelte and TypeScript checks for the main application                     |
| `pnpm check:all` | Check the portfolio, FOLIO, and catalog                                       |
| `pnpm lint`      | Check formatting with Prettier and lint with ESLint                           |
| `pnpm format`    | Apply Prettier formatting                                                     |
| `pnpm build`     | Validate content and design, generate static content, and build the portfolio |
| `pnpm build:all` | Build the portfolio, FOLIO package, and catalog                               |
| `pnpm preview`   | Preview the Cloudflare build locally                                          |

### End-to-end tests

Tests use Playwright and cover the portfolio, catalog, and FOLIO component harness.

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `pnpm e2e`           | Run the full end-to-end suite    |
| `pnpm e2e:portfolio` | Run portfolio tests              |
| `pnpm e2e:catalog`   | Run catalog tests                |
| `pnpm e2e:folio`     | Run FOLIO component tests        |
| `pnpm e2e:ui`        | Open Playwright's interactive UI |
| `pnpm e2e:report`    | Open the latest HTML test report |
| `pnpm e2e:install`   | Install Playwright browsers      |

### FOLIO and catalog

| Command                     | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `pnpm folio:check`          | Type-check the FOLIO package                                     |
| `pnpm folio:build`          | Package FOLIO for distribution                                   |
| `pnpm folio:pack:check`     | Smoke-check the packed tarball contents and manifest             |
| `pnpm folio:consumer:check` | Build and type-check an isolated app against the tarball         |
| `pnpm folio:publish`        | Build and publish `@benitoanagua/folio` to npm (requires npm authentication) |
| `pnpm catalog:check`        | Type-check the catalog                                           |
| `pnpm catalog:dev`          | Run the catalog development server                               |
| `pnpm catalog:build`        | Build the catalog                                                |
| `pnpm catalog:deploy`       | Build and deploy the catalog to Cloudflare Pages                |

### Cloudflare and D1 operations

The repository includes Wrangler scripts for Cloudflare Pages and D1. Review the operational documentation and confirm the target environment before running remote commands.

| Command                     | Purpose                                |
| --------------------------- | -------------------------------------- |
| `pnpm cf:login`             | Authenticate Wrangler                  |
| `pnpm cf:whoami`            | Show the active Cloudflare identity    |
| `pnpm cf:pages:list`        | List Pages projects                    |
| `pnpm cf:deploy:preview`    | Build and deploy a preview branch      |
| `pnpm cf:deploy:production` | Build and deploy the production branch |
| `pnpm d1:list`              | List D1 databases                      |
| `pnpm d1:migrations:local`  | Apply D1 migrations locally            |
| `pnpm d1:migrations:list`   | List Production migration state            |
| `pnpm d1:migrations:list:production` | List Production migration state       |
| `pnpm d1:migrations:list:preview`    | List Preview migration state          |
| `pnpm d1:migrations:remote` | Apply Production migrations (legacy alias) |
| `pnpm d1:migrations:production` | Apply reviewed migrations to Production |
| `pnpm d1:migrations:preview`    | Apply reviewed migrations to Preview    |
| `pnpm check:content`        | Verify local D1 content integrity      |
| `pnpm test`                 | Run loader, payload and editor tests   |

**Production caution:** inspect migrations, confirm the Cloudflare account and target database, and review the remote state before applying database changes or deploying.

## Content and data

Editable portfolio content lives in Cloudflare D1 (`portfolio_content`, `portfolio_projects`, `portfolio_cv_documents`) and is managed through `/admin`. The schema and initial bilingual seeds are versioned in `migrations/`; local development applies them with `pnpm d1:migrations:local`. All public pages are server-rendered at request time — nothing is prerendered.

Do not commit credentials, customer information, or production records. Treat remote database operations as deliberate deployment actions, not routine local development steps.

## Documentation

- [Documentation index](docs/README.md)
- [Architecture decisions](docs/adr/)
- [FOLIO reading constitution](docs/design/constitucion-lectura.md)
- [Portfolio UI/UX specification](docs/design/portfolio-ui-ux.md)
- [Skills and experience content guide](docs/content/skills-and-experience.md)
- [Cloudflare and Wrangler operations](docs/operations/cloudflare-wrangler.md)
- [D1 content operations](docs/operations/d1-content-migration.md)
- [Project content review checklist](docs/content/project-content-review.md)
- [Release operations](docs/operations/release.md)

## Related resources

- [Live portfolio](https://benitoanagua.pages.dev/)
- [GitHub profile](https://github.com/benitoanagua)
- [FOLIO source](packages/folio/)
- [FOLIO Catalog source](apps/catalog/)
