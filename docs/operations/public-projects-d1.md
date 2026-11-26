# Public project pages backed by D1

> Completed milestone. Public project reads come exclusively from `portfolio_projects`; the TOML sources and the transitional fallback were removed.

## Runtime behavior

- The root server layout loads both Spanish and English published project payloads from D1 on every request.
- Only rows with `is_published = 1` are exposed to the public site.
- The home featured-project section, project listing, project detail, related projects and skill-project cards use the layout's D1-backed data.
- Project detail routes are resolved at request time against the published set; unknown or unpublished slugs return 404.
- If D1 is unavailable or contains an invalid published record, the loaders throw and the request fails — there is no silent fallback to bundled content.

## Project payload contract

Each localized project document must provide the required project fields and arrays. Optional
`context` and `result` values must be strings when present. Optional `links` must be an object;
its `repo`, `demo`, and `case` properties must be strings when present. The admin save action
and public loader enforce the same shape so malformed data is rejected before it can be published
or rendered.

## Before enabling D1 content in production

The public loader requires the database to be seeded. To activate D1 content in the shared remote database:

1. Back up the production D1 database.
2. Apply the pending migrations (schema + seeds) explicitly:
   `pnpm d1:migrations:remote`
   This includes `0003_projects.sql` (schema) and `0004_projects_seed.sql` (content).
3. Verify:
   `pnpm dlx wrangler@4 d1 execute benitoanagua-portfolio --remote --command="SELECT COUNT(*) FROM portfolio_projects WHERE is_published = 1;"`
4. Visit the homepage, `/proyectos`, a project detail route, and at least one skill page after deployment.

Do not delete or rewrite `migrations/0004_projects_seed.sql`; it is the committed record of the initial project import. Subsequent content changes go through `/admin/proyectos` or new numbered migrations.
