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
`context` and `result` values must be strings when present. Optional `links` must be an object
containing only `repo`, `demo`, and `case`; each property must be a string when present. The
admin save action and public loader share the validator in `src/lib/server/project-payload.ts`,
so malformed data is rejected before it can be published or rendered. A published row whose
document does not match the row slug is rejected by the loader instead of being served.

## Slug rules

`slug` is the primary key of `portfolio_projects` and the public URL segment. It is immutable
for an existing project:

- The editor submits the loaded slug as `original_slug`.
- The save action rejects a different slug in the JSON document, so editing cannot create a
  duplicate row or orphan the original record.
- Creating a project with a slug that already exists is rejected with a conflict instead of
  silently overwriting the existing row.
- Saving a project that was deleted in another session is rejected; reload before retrying.

Renaming a project requires a deliberate migration or a new project, not an editor save.

## Unsaved changes in the admin editors

Both `/admin/proyectos` and the content editor track a baseline for the loaded record. The
dirty state is derived from real field differences, not from loading data. Unsaved edits:

- prompt before client-side navigation and before switching projects/documents;
- are preserved when validation fails;
- are cleared only after a successful save;
- do not block navigation when the form is clean.

The shared helpers live in `src/lib/utils/editor-state.ts` and
`src/lib/utils/unsaved-changes.svelte.ts`. The project editor also guards `beforeunload` for
reloads and hard navigations.

## Local verification

The payload, slug and editor-state rules are covered by the Node test suite:

```sh
pnpm test
```

The suite uses mocks and does not connect to D1 or require Cloudflare Access credentials.

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
