# Runtime sitemap backed by D1

The sitemap is now served by the SvelteKit endpoint at `/sitemap.xml`, rather than generated as a build-time static file.

## Data sources

- Core public routes are included explicitly.
- Project detail URLs are generated from the published projects returned by `loadPublicProjects`.
- Skill detail URLs are generated from the localized CV content returned by `loadPortfolioContent`, using the same skill slug logic as the skill pages.
- XML values are escaped before output.
- The response is served as `application/xml` and cached for one hour, with stale-while-revalidate.

## Build behavior

`scripts/generate-static.ts` no longer parses project/CV TOML to create a sitemap. It removes any stale generated `static/sitemap.xml` so an old static file cannot shadow the runtime endpoint. It continues to generate `robots.txt` and `manifest.json`; robots.txt still points crawlers to `/sitemap.xml`.

## Verification after deployment

1. Open `/sitemap.xml` and confirm the response is XML, not the old build-time snapshot.
2. Confirm each published project has a detail URL and unpublished projects do not.
3. Confirm skills from the current D1 CV data appear in the sitemap.
4. Check for duplicate URLs and valid XML escaping.
5. Confirm D1-backed pages report the expected data source.

The endpoint uses the existing temporary TOML fallback if D1 is unavailable. No production D1 writes or content deletion are part of this change.
