# Public project pages backed by D1

This change moves public project reads to the `portfolio_projects` table while keeping the TOML files as a transition fallback.

## Runtime behavior

- The root server layout loads both Spanish and English project payloads from D1.
- Only rows with `is_published = 1` are exposed to the public site.
- The home featured-project section, project listing, project detail, related projects and skill-project cards use the layout's D1-backed data.
- Project detail routes are resolved at request time; they are no longer generated as static entries from the TOML project list.
- If D1 is unavailable, empty, or contains an invalid localized record, the server logs a warning and temporarily uses the bundled TOML data. Check `projectsSource` in layout data when diagnosing the active source.

## Before enabling D1 content in production

The public loader is safe to deploy before the database import because it falls back to bundled content. To make D1 the active source:

1. Back up the production D1 database.
2. Apply migration `0003_projects.sql` to the intended database.
3. Generate `migrations/0004_projects_seed.sql` from the repository's bilingual project TOML using `pnpm d1:export-projects`.
4. Review the generated SQL, especially the project count, slugs, localized fields and publication flags.
5. Apply the reviewed seed explicitly to D1 and verify:
   `SELECT COUNT(*) FROM portfolio_projects WHERE is_published = 1;`
6. Visit the homepage, `/proyectos`, a project detail route, and at least one skill page. Confirm `projectsSource` is `d1` in the server data/logging path.

Do not remove `projects.es.toml` or `projects.en.toml` in this milestone. The build-time sitemap generator and skill-profile generation still depend on the CV/project sources. Removing those files is a separate migration after the sitemap and skill data have been migrated and checked.
