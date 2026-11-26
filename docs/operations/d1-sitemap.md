# Runtime sitemap backed by D1

The sitemap is served by the SvelteKit endpoint at `/sitemap.xml`, generated at request time from D1. There is no build-time sitemap and no static `sitemap.xml` in `static/` (the build removes stale generated output so it cannot shadow the endpoint).

## Data sources

- Core public routes are included explicitly.
- Project detail URLs are generated from the published projects returned by `loadPublicProjects`; unpublished records never appear.
- Skill detail URLs are generated from the localized CV content returned by `loadPortfolioContent`, using the same skill slug logic as the skill pages.
- XML values are escaped before output and URLs are deduplicated.
- The response is served as `application/xml` and cached for one hour (`s-maxage=3600`, `stale-while-revalidate=86400`), so content changes can take up to the TTL to appear for crawlers.

## Error behavior

The endpoint uses the same D1 loaders as the pages. If the binding is missing or the data is invalid, the request fails with an error rather than emitting a stale or partial sitemap.

## Verification after deployment

1. Open `/sitemap.xml` and confirm the response is XML from the runtime endpoint.
2. Confirm each published project has a detail URL and unpublished projects do not.
3. Confirm skills from the current D1 CV data appear in the sitemap.
4. Check for duplicate URLs and valid XML escaping.
