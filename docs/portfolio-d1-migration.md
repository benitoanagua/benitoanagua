# Portfolio content migration to Cloudflare D1

## Scope

This migration covers only the portfolio's information in Spanish and English:
- CV data: public profile, education, focus areas, skills and experience.
- Localized site copy and metadata.
- Authored skill narratives.
- Localized portfolio UI copy (excluding project/catalog copy).

It does not migrate or modify the design system, project catalog, project case studies, styles, components, or binary assets.

## Current source inventory

| Source | Content |
| --- | --- |
| `src/lib/data/cv.es.toml`, `cv.en.toml` | Profile, education, focus areas, skills and role history |
| `src/lib/data/site.es.toml`, `site.en.toml` | Site metadata, navigation, home and footer copy |
| `src/lib/data/skill-stories.ts` | Authored skill narratives in Spanish and English |
| `src/lib/data/ui-copy.ts` | Portfolio interface copy; project-specific copy is excluded |
| CV PDFs / image files | Assets, not D1 content; retain in Pages static assets or R2 |

## Storage format

The first migration stores each localized content document as validated JSON in
`portfolio_content`, keyed by locale and content type. This preserves the
existing nested CV structure while allowing independent document updates.
CV file records use `portfolio_cv_documents`; PDF bytes are not stored in D1.

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

Do not switch the production site to D1 until seed data has been generated from
the existing sources, the database has been populated, and parity tests pass.

## Rollout

1. Apply `migrations/0001_portfolio_content.sql` to a development D1 database.
2. Generate and load localized seed data from the existing portfolio sources.
3. Implement and test the D1 repository/data-access layer.
4. Verify Spanish and English page content against the current TOML-based output.
5. Deploy through a preview environment, then cut over production.

The migration is intentionally portfolio-only and does not touch design-system
or catalog files.
