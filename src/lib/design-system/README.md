# Svelte-native Design System

A native Svelte 5 implementation inspired by Strata's design foundations and component patterns. This does not embed Strata's Lit custom elements, Shadow DOM or a second runtime.

## Structure
- tokens.css: shared semantic tokens mapped to the portfolio theme.
- components/: typed Svelte primitives with scoped CSS.
- index.ts: public import surface.
- /design-system: component catalog and visual review route.

Initial primitives: Button, Badge, Card, TextField. Import from $lib/design-system. Keep portfolio-specific features in src/lib/components. Add further Strata catalog behaviors in small batches, preserving native semantics, keyboard support, visible focus and Svelte bindable state.
