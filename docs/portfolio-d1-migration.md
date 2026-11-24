# Portfolio content migration to Cloudflare D1

## Scope

This migration covers only the portfolio's information in Spanish and English:
- CV data: public profile, education, focus areas, skills and role history.
- Localized site metadata, navigation, home and footer content.
- Authored skill narratives.
- Public CV PDF metadata and paths.

It does not migrate or modify the design system, project catalog/case studies, styles, components, or binary assets. UI behavior and interface labels remain application code; only portfolio content is moved.

## Current source inventory

| Source | Content |
| --- | --- |
| `src/lib/data/cv.es.toml`, `cv.en.toml` | Profile, education, focus areas, skills and role history |
| `src/lib/data/site.es.toml`, `site.en.toml` | Localized site metadata and content |
| `src/lib/data/skill-stories.ts` | Authored skill narratives in Spanish and English |
| `src/routes/cv/+page.svelte` | Public labels and paths for current CV PDFs |
| CV PDFs / image files | Assets, not D1 content; retain in Pages static assets or R2 |

## Storage format

Localized CV, site and skill-story documents are stored as validated JSON in
`portfolio_content`, keyed by locale and content type. This preserves the
existing nested CV structure while allowing independent document updates.
CV file records use `portfolio_cv_documents`; PDF bytes are not stored in D1.

Generate the seed SQL from the repository sources:

```sh
pnpm d1:export-portfolio > migrations/0002_portfolio_seed.sql
```

The generated seed is deterministic and uses upserts. Review the generated file
before applying it to a D1 database.

## Runtime integration requirement

The current app imports TOML as raw modules and prerenders routes to static
HTML. A D1 binding is available only in the Cloudflare runtime, not as a
synchronous build-time import. Therefore the content cutover must:
1. Bind the D1 database in the Pages/Worker configuration.
2. Add server-side portfolio data access through `event.platform.env`.
3. Refactor portfolio routes/loaders to load localized content asynchronously.
4. Remove static prerender only from routes that need request-time D1 reads, or
   introduce a documented build-time export pipeline.
5. Keep the existing TOML source available until the D1-backed pages pass
   content-parity and deployment checks.

Do not switch the production site to D1 until seed data has been generated,
the database has been populated, and parity tests pass.

## Rollout

1. Apply `migrations/0001_portfolio_content.sql` to a development D1 database.
2. Generate `migrations/0002_portfolio_seed.sql` from the existing sources.
3. Load the localized seed data.
4. Implement and test the D1 repository/data-access layer.
5. Verify Spanish and English page content against the current TOML-based output.
6. Deploy through a preview environment, then cut over production.

The migration is intentionally portfolio-only and does not touch design-system
or catalog files.
