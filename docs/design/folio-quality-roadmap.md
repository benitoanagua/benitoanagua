# FOLIO — quality and release checklist

**Scope:** `packages/folio/` and `apps/catalog/`. The portfolio remains the consuming application.

## Current implementation

- 13 public components and the shared types exported from `packages/folio/src/lib/index.ts`.
- Svelte 5-native implementation with CSS custom properties, themes and shared tokens.
- Standalone Vite catalog consuming the package source; no portfolio D1 binding.
- Component contracts in [COMPONENTS.md](../../packages/folio/COMPONENTS.md).
- Component E2E coverage under `e2e/folio/`; catalog coverage under `e2e/catalog/`.
- CI includes type checks, formatting/lint, design/content validation, builds, package validation, isolated consumer smoke test and E2E.

## Remaining quality work

- [ ] Manual keyboard/focus review in current desktop browsers.
- [ ] Manual zoom/reflow review at 200% and 320 CSS px.
- [ ] Manual contrast and theme review, including disabled and interactive states.
- [ ] Review the deployed catalog live, including examples, links and theme switching.
- [ ] Record findings and fix only confirmed defects.

Automated axe and Playwright checks are necessary but do not replace the manual review above.

## Distribution status

- [x] Package build and tarball validation.
- [x] Isolated Svelte 5 consumer build and type check.
- [x] Catalog build and Cloudflare Pages deployment reported complete.
- [ ] Confirm live catalog smoke test after DNS/edge propagation.
- [ ] Publish `@benitoanagua/folio` after npm authentication; verify the registry version and install it from a clean consumer.

Do not publish automatically from CI. Keep package and catalog releases independent.

## Release criteria

- `pnpm check:all`, `pnpm lint`, `pnpm check:design`, `pnpm build:all`, `pnpm test` and relevant E2E suites pass.
- Package contents contain only intended exports, CSS, types and documentation.
- No breaking API change is published without a version bump and migration note.
- Design decisions follow the [reading constitution](constitucion-lectura.md).
