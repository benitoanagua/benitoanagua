# Skills and experience content model

The portfolio is organized around professional capabilities and the experience that gives them context. All editable content lives in Cloudflare D1 and is managed through `/admin` (protected by Cloudflare Access).

## Where content lives

- `portfolio_content` — one JSON document per locale and key: `cv`, `site`, `skill_stories`.
- `portfolio_projects` — bilingual project records with `is_published` and `sort_order`.
- `portfolio_cv_documents` — current CV file metadata (PDFs stay in `static/cv/`).

The schema and the initial bilingual seed are versioned in `migrations/` (`0001`–`0004`). Local development seeds them with `pnpm d1:migrations:local`; verify integrity with `pnpm check:content` (requires the local database).

## Add or update a skill

1. Edit the `cv` document for `es` and `en` in `/admin`: add the skill to the appropriate `focuses[].skills[]` group and the supporting `focuses[].experiences[]` entry.
2. The skill index and `/habilidades/<slug>` page are generated from the CV payload at request time. A slug is derived from the skill name; keep the spelling stable once published.
3. If the skill deserves a more personal explanation, add its narrative to the `skill_stories` document (keyed by the generated slug) for both locales.

## Evidence labels

- **Direct** means the skill's exact name appears in the experience description.
- **Context** means the skill is listed in the professional focus, but the role description does not explicitly name it. The page describes the role as context, not as proof of a specific implementation.

## Editorial principles

- Write in first person and explain how the capability was used, what responsibility it supported and in which professional context.
- Do not invent clients, project names, metrics, awards or outcomes.
- Keep enterprise and operational examples anonymized. Do not publish customer records, production identifiers, financial/tax data or internal screenshots.
- Keep Spanish and English narratives aligned in meaning.
- Add project records as separate evidence, not as a prerequisite for skill pages.

## Projects (separate evidence layer)

Projects live in `portfolio_projects` and are edited in `/admin/proyectos`. They are **evidence next to** the CV-based skill model, not a prerequisite for it.

1. Each record stores `content_es` and `content_en` JSON payloads. Required fields: `slug`, `area` (`dev | design | graphic | analysis | games`), `year`, `title`, `role`, `summary`, `stack`, `skills`, `highlights`. Optional: `featured`, `status` (`wip | done | spec`), `context`, `result`, `links` (`repo`, `demo`, `case`). Neutral fields (`slug`, `area`, `year`, `stack`, `skills`) must match across locales; the editor enforces this.
2. `skills` uses the skill's name. If its slug matches a skill derived from the CV, the project links to `/habilidades/<slug>` and that skill page lists the project automatically. If it does not match, it is shown as plain text (add the skill to the CV to get a page).
3. `is_published = 0` keeps a record in D1 without exposing it: it disappears from `/proyectos`, project detail routes and `sitemap.xml`.
4. `pnpm check:content` validates the local D1 content (structure, locale parity, document paths) and warns about skills without a page or projects without links.
5. Same editorial principles as above: no invented clients, metrics or outcomes. Leave `result` and `links` out until they can be backed up.
