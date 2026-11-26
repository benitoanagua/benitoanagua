# D1 content cutover — completed

> This checklist has been executed locally and the cutover is done in this branch: all public pages are server-rendered, the D1 loaders have no bundled fallback, and the TOML/TypeScript content sources were removed from runtime. What remains is the **remote** step described below.

## What changed

- `src/routes/+layout.ts` sets `prerender = false` for the whole site; every public page reads D1 at request time.
- `src/lib/server/portfolio-content.ts` and `src/lib/server/public-projects.ts` throw on a missing binding, query failure or invalid payload — no silent fallback.
- Deleted: `src/lib/data/{cv,site,projects}.{es,en}.toml`, `projects-loader.ts`, `skill-stories.ts`, `scripts/export-*.ts`, `scripts/validate-content.ts` and the `toml` dependency.
- Added: `scripts/verify-d1-content.ts` (`pnpm check:content`), unit tests in `tests/`, and `migrations/0004_projects_seed.sql` as the committed project seed.
- Fixed `migrations/0002_portfolio_seed.sql`: a comment containing the literal `BEGIN TRANSACTION` made Wrangler reject the file, so the seed could never be applied through `d1 migrations apply`. The comment was reworded; the SQL statements are unchanged.

## Remote steps still pending (explicit, production-impacting)

The remote D1 database is shared by Preview and Production. Before the first remote apply:

1. Back up remote D1 (`wrangler d1 export benitoanagua-portfolio --remote --output=backup.sql`).
2. Review pending migrations: `pnpm d1:migrations:list`.
3. Apply explicitly: `pnpm d1:migrations:remote` — this imports schema and seeds (`0002`, `0004` if pending).
4. Verify remote content:
   - `SELECT locale, content_key FROM portfolio_content;` → 6 rows.
   - `SELECT COUNT(*) FROM portfolio_cv_documents WHERE is_current = 1;` → 4 rows.
   - `SELECT COUNT(*) FROM portfolio_projects WHERE is_published = 1;` → expected project count.
5. Deploy a preview, then check `/`, `/proyectos`, a project detail, `/habilidades`, `/cv` and `/sitemap.xml`.
6. Confirm server logs show no loader errors.

## Local verification already performed

- `pnpm d1:migrations:local` applies `0001`–`0004` cleanly.
- `pnpm check:content` passes against the seeded local database.
- `pnpm build`, `pnpm check`, `pnpm test` and `pnpm e2e:portfolio` pass locally.
- Unpublished projects verified end-to-end: absent from listing, 404 on detail, absent from sitemap.
