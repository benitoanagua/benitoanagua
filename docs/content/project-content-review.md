# Project content review

Use this checklist when editing project records in `/admin/proyectos`. It is a maintenance checklist, not a repository of private editorial notes or unpublished project details.

## Before publishing or updating a project

- Confirm the project is public and that its description can be shared.
- Use a concise, accurate title, role, year, area, status and stack.
- Describe the work without confidential customer, employer or user information.
- Add repository, demo or case-study links only when they are public and verified.
- Add outcomes or metrics only when they are documented and can be substantiated.
- Keep Spanish and English content consistent for fields shared across locales.
- Check that skills referenced by the project resolve to the intended skill pages.
- Add screenshots or diagrams only when the content model supports them and the assets are cleared for publication.
- Verify the project listing, detail page, related-project links and sitemap after saving.

## Review existing published content

Existing records may already be visible on the public portfolio. Treat changes as updates to published content, not as a pre-publication queue. Confirm the current record in D1 before editing; do not infer publication state from this document.

If a project should not be public, unpublish it in the admin rather than relying on a documentation note.

## Skills

For a skill to have its own page, include it in the CV content's `focuses[].skills[]` in both locales. Run `pnpm check:content` locally and verify the corresponding skill page and project links.
