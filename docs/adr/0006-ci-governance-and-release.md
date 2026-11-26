# ADR 0006 — CI governance and release boundaries

- Status: Accepted
- Date: 2026-11-26

## Context

The repository contains a production portfolio, a publishable FOLIO package and a separately deployed catalog. Validation exists in GitHub Actions, while remote Cloudflare deploys and migrations are intentionally operator-controlled. The default branch currently lacks enforced protection.

## Decision

### Continuous integration

Every change intended for `main` must pass the repository's CI checks:

- Frozen pnpm dependency installation.
- Svelte/TypeScript checks for the portfolio, FOLIO and catalog.
- Prettier and ESLint.
- Unit and content-integrity tests.
- Design validation and production build.
- E2E tests using local D1.
- FOLIO package, packed artifact and isolated consumer checks.
- Catalog build.

CI is validation-only. It must not deploy to Cloudflare, apply remote migrations, publish npm packages or require production secrets.

### Branch governance

Protect `main` with:

- Pull requests required for changes.
- Required CI checks and successful status before merge.
- No force pushes or branch deletion.
- Restrict bypass to a deliberate administrator policy.
- Keep direct push as an emergency exception only if explicitly documented and audited.

The settings must be configured in GitHub repository rulesets/branch protection; documentation alone does not enforce them.

### Release boundaries

- Portfolio production deployment is a separate operational action after CI and migration review.
- FOLIO uses semantic versioning and a package release checklist; publishing is not part of ordinary CI.
- Catalog deployment is independent of package publication and uses its own Pages project.
- Release notes, package contents, consumer smoke test and target registry/project must be checked before release.

## Consequences

The repository can validate release readiness but cannot claim a release or infrastructure policy is active until the external service confirms it.
