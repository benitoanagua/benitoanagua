# Portfolio content in Cloudflare D1

D1 is the source of truth for editable portfolio content. The production cutover and Preview/Production isolation are complete; this guide describes the current runtime and safe operating procedures.

## Data model

- `portfolio_content`: localized CV, site and skill-story documents (`0001`).
- `portfolio_cv_documents`: public CV document metadata and paths.
- `portfolio_projects`: bilingual project records with publication state (`0003`).
- `0002` and `0004`: idempotent initial content seeds. They are migration history, not runtime inputs.

PDFs and images remain in `static/`. The design system, catalog and UI chrome copy are not stored in D1.

## Runtime

- `src/lib/server/portfolio-content.ts` validates content and CV document records.
- `src/lib/server/public-projects.ts` returns published projects only.
- The root server layout loads D1 content for each request. There is no bundled TOML fallback.
- Missing bindings, query failures or invalid published payloads fail closed rather than serving stale content.
- `/sitemap.xml` is generated at request time from published D1 content.

Content is edited through `/admin` and `/admin/proyectos`, protected by Cloudflare Access and server-side JWT validation.

## Environment isolation

Preview and Production have separate D1 resources:

| Environment | Database                         | ID                                     |
| ----------- | -------------------------------- | -------------------------------------- |
| Production  | `benitoanagua-portfolio`         | `e40020ce-adfb-4c14-b223-0a7b5e3de1b1` |
| Preview     | `benitoanagua-portfolio-preview` | `e35162cf-6599-4b2e-b1f9-ae4099382a4b` |

Preview's Pages `DB` binding is configured separately from the root Wrangler binding. The isolation write test on 2026-11-26 confirmed a test row existed only in Preview and was removed afterward. See [Cloudflare operations](cloudflare-wrangler.md) for binding and verification details.

## Local development

```sh
pnpm install
pnpm d1:migrations:local
pnpm check:content
pnpm dev
```

Local development uses the local D1 database through binding `DB`.

## Remote migration procedure

Apply migrations independently to each environment. Never assume the root Wrangler configuration targets Preview.

1. Verify the authenticated Cloudflare account and database IDs.
2. Export a backup of the target database and store it outside the repository.
3. Review the pending migration list and every SQL file.
4. Apply only to the intended database.
5. Verify migration history, record counts and the affected public routes.
6. Record the operation and backup location without committing the dump.

Production migrations require a confirmed, recoverable backup. Preview migrations must target `benitoanagua-portfolio-preview`; Production migrations must target `benitoanagua-portfolio`.

## Content safety

- Do not add ad-hoc production seed scripts or modify the committed initial seed migrations.
- Subsequent content changes belong in the admin UI; schema changes belong in new numbered migrations.
- Do not commit database exports, production records, credentials or local environment files.
