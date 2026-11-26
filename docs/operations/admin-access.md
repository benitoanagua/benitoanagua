# Portfolio admin: Cloudflare Access setup

The SvelteKit admin route at `/admin` is intentionally fail-closed. Configure the Cloudflare Access application and Pages runtime variables before using it.

## 1. Create the Access application

1. In Cloudflare Zero Trust, create a **Self-hosted** application for the portfolio hostname.
2. Protect the path `/admin*` (include actions and nested admin paths) with an Allow policy restricted to your exact email identity.
3. Enable the normal Cloudflare Access login flow and require email verification.
4. Copy the application's **Application Audience (AUD) Tag**.
5. Use the Access team domain shown in the Zero Trust dashboard, without the protocol, e.g. `your-team.cloudflareaccess.com`.

Do not rely only on a hidden admin link. The application validates the signed `Cf-Access-Jwt-Assertion` token and checks issuer, audience, expiry, signature and the configured administrator email before loading or writing content.

## 2. Configure Pages environment variables

Set these in the Cloudflare Pages project under Settings → Variables and Secrets, for both Production and Preview as appropriate:

- `ACCESS_TEAM_DOMAIN`: Access team domain, without `https://`.
- `ACCESS_AUD`: the application's audience tag.
- `ADMIN_EMAIL`: the exact email allowed to administer content.

Use the same values for local development only in a local, untracked environment file or Wrangler secret/variable configuration. Never commit the audience tag or personal email into source configuration.

## 3. D1 access

The admin uses the existing `DB` binding and updates only the allow-listed `portfolio_content` keys (`cv`, `site`, `skill_stories`) for `es` and `en`. All SQL values are bound parameters and JSON shape is validated server-side.

This first admin milestone is a document editor. Project records, richer field-based editing, draft/publish workflow, audit log and R2 asset management are follow-up work; do not remove project TOML or other content sources until those migrations are completed and verified.

## 4. Deployment checklist

- [ ] Access application and path policy configured.
- [ ] Access JWT audience and team domain configured in Pages.
- [ ] Administrator email configured.
- [ ] Confirm unauthenticated `/admin` requests are denied at the edge and by the server.
- [ ] Confirm a different authenticated email is denied by the server.
- [ ] Test edits against a local D1 database first.
- [ ] Back up the shared database before any production content changes.
