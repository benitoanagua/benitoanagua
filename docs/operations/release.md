# Release operations

This guide defines release boundaries for the portfolio, FOLIO and the component catalog. It does not publish packages or deploy infrastructure by itself.

## Release principles

- CI validates source and release artifacts; it does not publish or deploy.
- Portfolio, FOLIO and catalog releases are independent.
- Confirm the target registry, Cloudflare account, Pages project and branch before any release action.
- Do not publish a package until its version, package contents, README, changelog/release notes and consumer compatibility have been reviewed.
- Do not apply remote D1 migrations as part of a package or catalog release.

## Portfolio

1. Confirm CI is green on the exact commit to release.
2. Review pending D1 migrations and export/backup the production database before schema changes.
3. Verify the production Cloudflare account, Pages project and production D1 binding.
4. Build and deploy using the documented production command.
5. Verify the public site, localized routes, sitemap and critical admin/public flows.
6. Record the deployed commit and any migration applied.

## FOLIO package

1. Review the public API and breaking changes.
2. Update the package version according to semantic versioning.
3. Run pnpm check:all, pnpm lint, pnpm test, pnpm build:all, pnpm folio:pack:check and pnpm folio:consumer:check.
4. Inspect the packed package contents; ensure only intended files and no secrets, local files or portfolio-specific runtime code are included.
5. Confirm the npm account, package scope and registry target.
6. Publish explicitly with pnpm folio:publish only after approval of the version and package contents.
7. Verify the published version and install it into a clean consumer test.

## FOLIO Catalog

1. Build with pnpm catalog:build.
2. Verify the target Cloudflare account and Pages project benitoanagua-design-system.
3. Confirm the production branch and current deployment.
4. Deploy with pnpm catalog:deploy.
5. Verify the live catalog, component examples and links to the corresponding package version.

The catalog is a separate Pages application and must not use the portfolio's D1 database.

## Release record

For each release, record:

- Component (portfolio, FOLIO or catalog)
- Version or deployed commit
- CI run URL and result
- Target registry/account/project/branch
- Migration or infrastructure changes, if any
- Post-release verification and rollback/recovery notes
