# Portfolio design system (Svelte 5)

A Svelte-native design system inspired by Strata's design foundations and interaction patterns, narrowed to the needs of a personal portfolio. It does not embed Strata's Lit custom elements, Shadow DOM, or a second runtime.

## Component scope

### Portfolio components
- `ProjectCard`: project preview with image, category/year, summary, technology tags, case-study and source links.
- `SectionHeading`: consistent section eyebrow, title, and optional description.
- `Timeline`: education, experience, and milestone history.
- `SocialLinks`: accessible professional/social link list.
- `Metric`: concise impact or portfolio statistic.

### Shared visual primitives
- `Button`, `Badge`, `Card`, `TextField`, `Divider`.

Import from `$lib/design-system`. Keep site-specific page composition and data in route or portfolio feature modules; keep reusable presentation primitives here.

## Deliberately excluded
Application-oriented controls such as toggles, checkboxes, progress indicators, tabs, accordions, loading skeletons, and generic alert states were removed from this portfolio-focused catalog. Add them only if a concrete portfolio interaction needs them.

## Quality bar
Components use Svelte 5 props/snippets and scoped CSS, semantic HTML, keyboard-native links and controls, visible focus styles where interactive, responsive layouts, and reduced-motion handling where animation is used. Validate with the repository's check, lint, and build scripts before merging.
