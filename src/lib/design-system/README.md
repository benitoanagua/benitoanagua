# FOLIO design system (Svelte 5)

A Svelte-native, reading-first design system: warm paper, near-black ink, filete rules, no elevation, and a single red accent. Derived from Strata's structural ideas (hairlines, tonal surfaces) without importing its Lit runtime. See `docs/adr/0003-folio-reading-design-system.md` and `docs/constitucion-lectura.md`.

## Where things live

- `tokens.css` — type scale (`--text-*`, `--leading-*`, `--tracking-*`), measure, marginia grid, rules (`--rule-*`), radii, focus and motion tokens. Imported globally by `src/routes/+layout.svelte` and re-exported here.
- `utilities.css` — `.kicker`, `.meta`, `.label` (the only code-forced uppercase roles), `.rule-*`, `.prose`, `.drop-cap`.
- `components/` — the 13 components below. Colors come from `--color-*` in `src/lib/styles/theme.css`; spacing from `--space-*` in `src/lib/styles/app.css`.
- Palette and contrast pairs are validated by `pnpm run check:design` (`scripts/validate-design.ts`).

## Component scope

### Portfolio components

- `ProjectCard`: project preview with image, category/year, summary, technology tags, case-study and source links.
- `SectionHeading`: consistent section eyebrow (`.kicker`), title, optional description and thick rule.
- `Timeline`: education, experience, and milestone history with square markers.
- `SocialLinks`: accessible professional/social link list (`compact` for ruled rows).
- `Metric`: concise impact or portfolio statistic.
- `Notice`: labelled note/success/warning/error block (`role="alert"` only for `error`). Used on `/cv` for the PDF language notice.
- `Pullquote`: accented blockquote for standout phrases.
- `Marginalia`: two-column metadata rail + body layout used by detail pages.

### Shared visual primitives

- `Button`, `Badge`, `Card`, `TextField`, `Divider`.

Import from `$lib/design-system`. Keep site-specific page composition and data in route or portfolio feature modules; keep reusable presentation primitives here.

## Deliberately excluded

Application-oriented controls such as toggles, checkboxes, progress indicators, tabs, accordions, loading skeletons, and generic alert states were removed from this portfolio-focused catalog. Add them only if a concrete portfolio interaction needs them.

## Quality bar

Components use Svelte 5 props/snippets and scoped CSS, semantic HTML, keyboard-native links and controls, visible focus styles where interactive, responsive layouts, and reduced-motion handling where animation is used. Every text renders at ≥ 1rem, radii stay ≤ 2px, and no elevation (`box-shadow`) is used — `scripts/validate-design.ts` enforces this. Validate with the repository's check, lint, check:content, check:design, and build scripts before merging.
