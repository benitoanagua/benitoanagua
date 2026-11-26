# Admin dashboard — FOLIO implementation

The admin workspace is an application pattern built on FOLIO, not a separate visual system.

## Rules

- Consume the shared FOLIO stylesheet and its `--color-*`, `--font-*`, `--text-*`, `--space-*` and `--rule-*` tokens. Do not introduce a dashboard palette, shadows, pills, decorative icons, or independent typography.
- Use FOLIO's reading hierarchy: serif page titles, readable descriptions, hairline separators, generous spacing, and warm paper/ink surfaces in both themes.
- Keep UI labels at least `1rem`; use relative units and preserve visible labels and keyboard focus.
- Status always includes a word; color only reinforces its meaning.
- The dashboard may add app-specific composition components under `src/lib/components/admin/`. Keep data editing, authentication and authorization in route/server code, not in visual components.
- Do not export portfolio-CMS-specific components from the public `@benitoanagua/folio` package unless they become a generic, documented component with catalog coverage.

## Admin composition components

- `AdminWorkspaceNav`: authenticated identity, Access logout and current workspace navigation.
- `AdminPageHeader`: kicker, title and explanatory text using FOLIO typography.
- `AdminStatus`: text-first neutral/success/warning/error status.
- `AdminDocumentNav`: select the D1 content key and language.

These components are intentionally composed from FOLIO tokens and should be reused across admin routes. Future overview metrics, data lists and settings should follow the same contracts and should not reintroduce custom Material-style cards or dense 12px metadata.
