# ADR 0003 — FOLIO reading-first design system

- Status: Accepted
- Date: 2026-11-24

## Context

The site shipped with an "architectural outline" identity: Archivo Black in uppercase, Sora/Inter/JetBrains Mono, an orange/teal Material palette, pills and fluid radii. The owner decided to replace it with **FOLIO**, a typographic reading system derived from Strata's structure (hairlines, no elevation, ink on paper) with its own voice: warm paper, near-black ink, a single red "corrector's ink" accent, reading serifs and newspaper-like page composition.

Conflicts found while reading the repository:

- `docs/ui-ux-spec.md` declared the outline identity as one to keep, allowed 12px minimum text, and forbade code-forced uppercase.
- The design system lived in `src/lib/design-system/` with `--ds-*` tokens, hex colors inside components, `border-radius: 999px` pills, `box-shadow` focus rings, and `font-size` values down to 0.6875rem (51 declarations of 0.75rem or less across `src/`).
- Pre-existing breakage: `eslint.config.js` imported `eslint-plugin-storybook` (not installed), `@material/material-color-utilities` was an unused dependency, and 29 files failed `prettier --check` (the design-system files were minified to a single line).
- `static/manifest.json` and `<meta name="theme-color">` used pure black/white, unrelated to either palette.

## Decision

**FOLIO replaces "architectural outline".** The shared-boundary grid logic survives as the filete (rule) system; the rest of the identity is replaced. The Constitution of reading (`docs/constitucion-lectura.md`) is the supreme norm; where it conflicts with the previous spec, it wins.

- **Palette:** `material-theme.css` is renamed to `theme.css` and rewritten. The Material variable names (`--color-*`) are kept as the contract used across the codebase, but values become warm paper (`#F5F0E6`), near-black ink (`#16140F`), and a single red accent `#8F1D17` (light) / `#E58A82` (dark). Secondary/tertiary collapse to ink tones; new `--color-ink-soft`, `--color-success` and `--color-warning` tokens are added. `error` shares the accent hue and is always paired with a visible label and a thick rule, never color alone.
- **Typography:** Archivo Black, Inter, Sora and JetBrains Mono are removed. One Google Fonts request loads Playfair Display (titles), Vollkorn (body) and Mulish (UI). `--font-mono` is deleted; former mono uses become `.meta`.
- **Minimum text size:** 1rem everywhere, labels and metadata included (Constitution Art. 4). `scripts/validate-design.ts` (`pnpm run check:design`, chained into `build`) enforces R1–R8 and blocks violations.
- **Uppercase:** only in the three short-label roles `.kicker`, `.meta`, `.label` (≤ 4 words) and the wordmark. Never in headings or running text.
- **Focus:** `outline: 3px solid var(--color-primary); outline-offset: 3px` via `:focus-visible`; the `box-shadow` ring is abolished.
- **Shape:** radii 0–2px (`--radius-sm`), no pills, no decorative circles (spinner and switch exempted if ever added). Elevation is abolished; separation comes from rules, space and tonal surfaces.
- **Components:** the catalog grows to 13 by adding `Notice`, `Pullquote` and `Marginalia`, each with a real use on the site (`/cv` PDF language note, project/skill highlights, detail-page metadata rails). `Divider` gains a `variant` prop; `TextField` gains `error`/`type`; `SectionHeading` gains `level`/`rule`; `SocialLinks` gains `label`/`compact` rows.
- **Docs:** this ADR, the Constitution, `docs/ui-ux-spec.md` (§4, §5, §7, §8, §10) and both READMEs are updated in the same change set, per the spec's own rule that code and document must not diverge.

## Consequences

- `ui-ux-spec.md` §4 is superseded: the outline identity is replaced, the 12px floor becomes 1rem, uppercase-by-code is restricted to the three label roles, and focus moves from shadow ring to outline. §5 gains the three new components; §8 updates min text size, 48px/44px touch targets and outline focus; §10 adds `check:design`.
- ADR 0002 stays in force for what it decided (Svelte-native, no Strata runtime, small portfolio-focused catalog) — amended, not revoked: the catalog now includes `Notice` because `/cv` needs a language notice.
- `--color-primary` stops meaning "brand decoration". Decorative uses (borders, big icons, markers) migrate to `--color-on-background` or `--color-outline-variant`; the accent is reserved for links, focus, kickers, active states and the italic surname in the homepage title.
- All `--ds-*` tokens are removed; components use `--color-*`, `--space-*`, `--text-*` and `--rule-*` directly.
- `pnpm run lint` required formatting 29 previously unformatted files; that churn is formatting-only and lands in the chore commit.

## Additional decisions

The package source is canonical in `packages/folio/src/lib`; the standalone catalog in `apps/catalog` documents the public component API.

- `logo-box` (initials square) removed: the wordmark alone preserves the header height and the spec allows either option; removing it avoids a decorative box that FOLIO's filete system does not need.
- Typography, color, spacing and utility tokens now live in the publishable `packages/folio/src/lib/styles/` entry. The portfolio and catalog consume this same source; npm packaging produces `dist/`.
- `theme-color` metas and `manifest.json` adopt the paper/ink colors (`#F5F0E6` light, `#16140F` dark).
