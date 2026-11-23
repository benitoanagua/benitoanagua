# Skills and experience content model

The portfolio is now organized around professional capabilities and the experience that gives them context. Project case studies can be added later without changing this model.

## Add or update a skill

1. Add the skill to the appropriate `[[focuses.skills]]` group in `src/lib/data/cv.es.toml` and `src/lib/data/cv.en.toml`.
2. Add or update the relevant `[[focuses.experiences]]` entry in the same focus. Use the role, organization, period and responsibilities supported by the CV.
3. The skill index and `/habilidades/<slug>` page are generated from those TOML entries. A slug is derived from the skill name; keep the spelling stable once published.
4. If the skill deserves a more personal explanation, add a bilingual narrative to `src/lib/data/skill-stories.ts` using the generated slug as the key.

## Evidence labels

- **Direct** means the skill's exact name appears in the experience description.
- **Context** means the skill is listed in the professional focus, but the role description does not explicitly name it. The page describes the role as context, not as proof of a specific implementation.

## Editorial principles

- Write in first person and explain how the capability was used, what responsibility it supported and in which professional context.
- Do not invent clients, project names, metrics, awards or outcomes.
- Keep enterprise and operational examples anonymized. Do not publish customer records, production identifiers, financial/tax data or internal screenshots.
- Keep Spanish and English narratives aligned in meaning.
- Add project pages later as separate evidence, not as a prerequisite for skill pages.
