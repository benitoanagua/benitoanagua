# ADR 0004 — Portfolio modular monolith

- Status: Accepted
- Date: 2026-11-26

## Context

The portfolio is a server-rendered SvelteKit application with related content domains (profile, experience, skills, CV metadata and projects). FOLIO and its catalog are related deliverables, but they have different release and runtime needs. Splitting the portfolio into networked services would add operational overhead without a demonstrated scaling or ownership requirement.

## Decision

Keep the portfolio as a **modular monolith** running on SvelteKit, Svelte 5 and TypeScript.

- Route handlers and server load functions are delivery adapters; they should not own domain rules or raw persistence logic.
- Server-side modules organize content, projects, CV, administration, validation and SEO by responsibility.
- D1 access remains behind server-side data modules. Browser components receive validated data through SvelteKit page data and never query D1 directly.
- Public loaders return published, validated content only. Invalid or unavailable required content fails explicitly rather than silently serving stale bundled data.
- FOLIO remains a separate workspace package. The portfolio may consume it, but the package must not import portfolio application code.
- The catalog remains a separate Vite application and must not depend on the portfolio runtime or its D1 binding.
- Static binary assets remain in the static asset layer; D1 stores metadata and editable structured content.

## Consequences

- Domain boundaries are enforced through module ownership and import direction, not separate deployments.
- New services are considered only when a concrete need exists (independent scaling, security boundary, ownership or reliability requirement) and an ADR records the trade-off.
- Keep application services and data access testable with injected interfaces, especially for D1.
- Do not move business rules into UI components or SQL-only shortcuts.
