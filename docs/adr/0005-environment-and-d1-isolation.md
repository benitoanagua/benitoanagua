# ADR 0005 — Environment isolation and D1 safety

- Status: Accepted — implemented and verified
- Date: 2026-11-26

## Context

At the time of this decision, Cloudflare Pages Preview and Production shared a D1 binding, allowing Preview writes to affect production content. That initial configuration has since been corrected: Preview and Production now use separate D1 resources. The implementation and controlled isolation test are recorded in [Cloudflare operations](../operations/cloudflare-wrangler.md). Local development uses Wrangler's local D1.

## Decision

The target architecture has three isolated environments:

| Environment | Runtime                        | Database                                                      |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| Local       | Wrangler / local Pages runtime | Local D1 with reviewed migrations and non-production fixtures |
| Preview     | Cloudflare Pages Preview       | Dedicated Preview D1                                          |
| Production  | Cloudflare Pages production    | Production D1                                                 |

The database binding name remains `DB` in every environment; the bound database resource differs by environment.

- Preview must not bind to Production D1.
- Apply the same schema migrations independently to each environment after reviewing them.
- Preview content may be seeded with sanitized or representative data; never copy private or production-only records by default.
- Remote migrations and deploys are explicit operator actions. CI must not hold production Cloudflare credentials or apply remote migrations.
- Before any environment change, verify the active Cloudflare account, Pages project, database name/ID, migration status and backup/restore plan.
- Preview write-path testing is allowed only against the dedicated Preview D1 after verifying the active binding. Never use Preview as a substitute for a Production backup.

## Verification criteria

Isolation is complete only when:

1. Cloudflare configuration shows distinct Preview and Production D1 resources.
2. Each environment's migration history is current and independently inspectable.
3. A controlled Preview write is visible in Preview D1 and absent from Production D1.
4. Production remains read/write only through the intended production administration path.
5. Operational documentation reflects the actual bindings.

## Consequences

The separation is configured and verified in Cloudflare. The controlled test confirmed a Preview write was absent from Production; the test row was then removed. See the operational guide for current resource IDs and the verification date.
