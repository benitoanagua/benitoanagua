# ADR 0005 — Environment isolation and D1 safety

- Status: Accepted
- Date: 2026-11-26

## Context

The Cloudflare Pages Preview and Production deployments currently share the same D1 database binding. This permits a preview build or administrative workflow to affect production content. Local development already uses Wrangler's local D1.

## Decision

The target architecture has three isolated environments:

| Environment | Runtime | Database |
| --- | --- | --- |
| Local | Wrangler / local Pages runtime | Local D1 with reviewed migrations and non-production fixtures |
| Preview | Cloudflare Pages Preview | Dedicated Preview D1 |
| Production | Cloudflare Pages production | Production D1 |

The database binding name remains `DB` in every environment; the bound database resource differs by environment.

- Preview must not bind to Production D1.
- Apply the same schema migrations independently to each environment after reviewing them.
- Preview content may be seeded with sanitized or representative data; never copy private or production-only records by default.
- Remote migrations and deploys are explicit operator actions. CI must not hold production Cloudflare credentials or apply remote migrations.
- Before any environment change, verify the active Cloudflare account, Pages project, database name/ID, migration status and backup/restore plan.
- Until Preview D1 is isolated and verified, Preview is treated as production data and write-path testing is prohibited there.

## Verification criteria

Isolation is complete only when:

1. Cloudflare configuration shows distinct Preview and Production D1 resources.
2. Each environment's migration history is current and independently inspectable.
3. A controlled Preview write is visible in Preview D1 and absent from Production D1.
4. Production remains read/write only through the intended production administration path.
5. Operational documentation reflects the actual bindings.

## Consequences

The repository documents and supports the intended separation, but account-level binding configuration is not complete merely by adding configuration text. It must be verified in Cloudflare.
