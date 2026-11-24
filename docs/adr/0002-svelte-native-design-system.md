# ADR 0002: Svelte-native portfolio design system

- Status: Accepted — amended by ADR 0003 (FOLIO replaces the outline identity; the catalog now includes `Notice`, `Pullquote` and `Marginalia`)
- Date: 2026-11-24

## Decision

Create `src/lib/design-system` for semantic tokens and reusable Svelte 5 components specifically useful to a personal portfolio. Keep page composition and portfolio-specific data in route or feature modules. Provide a barrel export and a living showcase.

The component surface prioritizes project presentation, section hierarchy, experience/milestone timelines, impact metrics, and professional links, alongside a small set of shared visual primitives. Do not port application-oriented controls from Strata without a concrete portfolio use case.

Reimplement Strata's design intent and relevant interaction patterns; do not import its Lit runtime, custom elements, or Shadow DOM.

## Consequences

SvelteKit owns component compilation, state, and styles. The design system remains intentionally small and portfolio-focused. Expand only when a real portfolio requirement justifies a reusable component, and preserve semantic HTML, keyboard accessibility, responsive behavior, and visible focus.
