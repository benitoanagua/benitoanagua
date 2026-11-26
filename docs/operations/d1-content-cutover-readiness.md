# D1 content cutover — completed

> The cutover is fully executed: all public pages are server-rendered, the D1 loaders have no bundled fallback, the TOML/TypeScript content sources were removed from runtime, and the remote D1 migrations plus Preview/Production deploys were applied and verified on 2026-11-25.

## What changed

- `src/routes/+layout.ts` sets `prerender = false` for the whole site; every public page reads D1 at request time.
- `src/lib/server/portfolio-content.ts` and `src/lib/server/public-projects.ts` throw on a missing binding, query failure or invalid payload — no silent fallback.
- Deleted: `src/lib/data/{cv,site,projects}.{es,en}.toml`, `projects-loader.ts`, `skill-stories.ts`, `scripts/export-*.ts`, `scripts/validate-content.ts` and the `toml` dependency.
- Added: `scripts/verify-d1-content.ts` (`pnpm check:content`), unit tests in `tests/`, and `migrations/0004_projects_seed.sql` as the committed project seed.
- Fixed `migrations/0002_portfolio_seed.sql`: a comment containing the literal `BEGIN TRANSACTION` made Wrangler reject the file, so the seed could never be applied through `d1 migrations apply`. The comment was reworded; the SQL statements are unchanged.

## Remote steps — executed 2026-11-25

The remote D1 database is shared by Preview and Production. The following was performed:

1. Backed up remote D1 (`wrangler d1 export benitoanagua-portfolio --remote`) before applying anything.
2. `pnpm d1:migrations:list` showed `0003_projects.sql` and `0004_projects_seed.sql` pending (`0001`/`0002` were already applied).
3. `pnpm d1:migrations:remote` applied both successfully.
4. Verified remote content:
   - `portfolio_content` → 6 rows (cv/site/skill_stories × es/en).
   - `portfolio_cv_documents` current → 4 rows.
   - `portfolio_projects` → 15 rows, all published.
5. Deployed Preview (`pnpm cf:deploy:preview`) and verified `/`, `/proyectos`, project details, `/habilidades`, `/cv` and `/sitemap.xml` (154 URLs) — all 200; `/admin` → 503 without Access credentials.
6. Deployed Production (`pnpm cf:deploy:production`) and re-verified the same routes — all 200; the 4 CV PDFs serve `application/pdf`; `/admin` → 503.

## Local verification already performed

- `pnpm d1:migrations:local` applies `0001`–`0004` cleanly.
- `pnpm check:content` passes against the seeded local database.
- `pnpm build`, `pnpm check`, `pnpm test` and `pnpm e2e:portfolio` pass locally.
- Unpublished projects verified end-to-end: absent from listing, 404 on detail, absent from sitemap.
