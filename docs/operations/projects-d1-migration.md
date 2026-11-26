# Projects migration to D1

This milestone adds a D1 table and a bilingual project editor. It intentionally does not switch the public project loader yet; the public routes, skill links and sitemap still consume the TOML source and must remain stable until the next runtime-loader change is verified.

## Local migration and import

1. Create a backup of the local D1 database.
2. Apply schema migration 0003:
   `pnpm dlx wrangler@4 d1 migrations apply benitoanagua-portfolio --local`
3. Generate the bilingual seed:
   `pnpm d1:export-projects`
   This writes `migrations/0004_projects_seed.sql` from both project TOML files, validating the same slug set and neutral fields (area, year, stack, skills).
4. Review the generated SQL and apply it locally:
   `pnpm dlx wrangler@4 d1 execute benitoanagua-portfolio --local --file=migrations/0004_projects_seed.sql`
5. Check the count and sample localized payloads:
   `pnpm dlx wrangler@4 d1 execute benitoanagua-portfolio --local --command="SELECT slug, area, is_published FROM portfolio_projects ORDER BY sort_order"`

Do not apply to production in this PR. After local verification, back up remote D1, apply the schema migration and the reviewed seed explicitly, then validate counts and bilingual content before enabling the public D1 loader.

## Admin

Access-protected `/admin/proyectos` supports selecting, creating, updating, publishing/unpublishing and deleting project records. The editor uses JSON for complete project fields so optional fields and link structures are not silently lost. It validates required fields and enforces the shared slug, area, year, stack and skills across languages.

## Remaining before TOML removal

- Switch public project reads to D1 and pass server-loaded data into components.
- Convert project detail route to dynamic SSR (no static entries from TOML).
- Move sitemap project slugs to runtime or a deployment-time D1 export strategy.
- Remove `projects.es.toml` and `projects.en.toml` only after all project, skill, build and e2e checks pass.
- Migrate skill profiles and stories, experience/CV/site, static generation dependencies and fallback paths.
