# Release operations

This guide defines release boundaries for the portfolio, FOLIO and the component catalog. CI validates artifacts; it does not publish packages, deploy Pages or apply remote migrations.

## Release principles

- Portfolio, FOLIO and catalog releases are independent.
- Confirm the target account, project, branch, registry and version before a release.
- Review package contents and release notes before publishing.
- Do not couple package/catalog releases to remote D1 migrations.

## Current release status

- **Portfolio:** deployed at [benitoanagua.pages.dev](https://benitoanagua.pages.dev/). Verify the current commit and CI before a new production deployment.
- **FOLIO:** `@benitoanagua/folio@0.1.0` build, pack check and isolated consumer smoke test passed in the last reported validation. npm publication requires authenticated registry access; verify whether the version is already published before retrying.
- **Catalog:** deployed to Pages project `benitoanagua-design-system`; the last reported deployment URL was [4d8d8641.benitoanagua-design-system.pages.dev](https://4d8d8641.benitoanagua-design-system.pages.dev/). Live smoke verification was pending DNS/edge propagation at last report.

## Portfolio

1. Confirm CI is green on the exact commit.
2. Review migrations and export/backup Production before schema changes.
3. Verify Cloudflare account, Pages project and Production D1 binding.
4. Build and deploy with the documented production command.
5. Verify public routes, localized content, sitemap and admin protection.
6. Record the deployed commit and migration, if any.

## FOLIO package

1. Verify whether the intended version already exists in npm.
2. Review public API, version, README/release notes and package contents.
3. Run `pnpm check:all`, `pnpm lint`, `pnpm test`, `pnpm build:all`, `pnpm folio:pack:check` and `pnpm folio:consumer:check`.
4. Authenticate to the intended npm account and confirm scope `@benitoanagua`.
5. Publish explicitly with `pnpm folio:publish` only if the version is not already published.
6. Verify the registry version and install it in a clean consumer.

## FOLIO Catalog

1. Build with `pnpm catalog:build`.
2. Confirm Cloudflare account, Pages project `benitoanagua-design-system` and production branch `main`.
3. Deploy with `pnpm catalog:deploy`.
4. Verify the live catalog, component examples, themes and package links.

The catalog is independent and must not use the portfolio D1.

## Release record

For each release, record the component, version/deployed commit, CI run, target, migration/infrastructure changes, post-release verification and recovery notes.
