# ADR 0002: Svelte-native design system

- Status: Accepted
- Date: 2026-11-24

## Decision

Create src/lib/design-system for semantic tokens and reusable Svelte 5 primitives. Keep portfolio shell and feature components in src/lib/components. Provide a barrel export and a living showcase. Reimplement Strata's design and interaction intent; do not import its Lit runtime or custom elements.

## Consequences

SvelteKit owns component compilation, state and styles. The catalog will be ported incrementally with typed APIs and accessible native elements.
