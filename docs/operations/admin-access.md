# Portfolio admin: Cloudflare Access setup

The SvelteKit admin at `/admin` is fail-closed. Cloudflare Access must protect the route at the edge, and the application independently verifies the signed Access JWT before loading or changing data.

## 1. Create the Access application

1. In Cloudflare Zero Trust, open **Access controls → Applications** and create a **Self-hosted** application.
2. Add the exact portfolio hostname and protect the path `/admin*` so the content editor, project editor, and form actions are covered.
3. Add an **Allow** policy with the exact administrator email address. Keep the policy restricted to that identity; do not allow an entire email domain unless intentionally required.
4. Select the login method you intend to use (Cloudflare, an identity provider, or One-time PIN if enabled for your organization).
5. Copy the application's **Application Audience (AUD) Tag** and the Access team domain shown in Zero Trust.

Access applications deny by default unless a user matches an Allow policy. Do not rely on a hidden admin link or client-side UI state as an access control.

## 2. Configure an authenticator (MFA)

For a personal admin account, enable independent MFA in Cloudflare Access:

1. Go to **Zero Trust → Access controls → Access settings**.
2. Under **Allow multi-factor authentication (MFA)**, enable **Authenticator application** (TOTP).
3. Choose a short, reasonable authentication duration for the admin workspace.
4. In **Access controls → Applications**, edit the portfolio application and ensure its MFA setting respects the organization policy or explicitly requires the allowed authenticator.
5. Enroll an authenticator app (for example, a TOTP app) in the Cloudflare Access user portal and store recovery options securely.

Cloudflare Access also supports passkeys and identity-provider MFA. Prefer a passkey/security key or authenticator-based MFA over email-only OTP when available. See Cloudflare's [independent MFA documentation](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/independent-mfa/) and [MFA requirements](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/mfa-requirements/).

## 3. Configure Pages environment variables

Set these in the Cloudflare Pages project under **Settings → Variables and Secrets**, for both Production and Preview environments that will host the protected admin:

- `ACCESS_TEAM_DOMAIN`: Access team domain, without `https://`.
- `ACCESS_AUD`: the application's audience tag.
- `ADMIN_EMAIL`: the exact email allowed to administer content.

Use local values only in an untracked local environment file or Wrangler local configuration. Never commit secrets or private identity configuration.

The server validates the `Cf-Access-Jwt-Assertion` signature, issuer, audience, expiry, not-before time, and configured administrator email. The shared admin layout also sets `Cache-Control: private, no-store` and a no-index header.

## 4. Admin dashboard

- `/admin`: localized content editor for `site`, `cv`, and `skill_stories`.
- `/admin/proyectos`: bilingual project editor.
- The shared admin shell displays the authenticated identity, navigation, and a sign-out link to `/cdn-cgi/access/logout`.

The page and all mutation actions validate the administrator identity server-side. The admin uses the existing `DB` binding; SQL values are bound parameters and payloads are validated before writes.

## 5. Verification checklist

- [ ] Access application covers `/admin*` on the intended hostname.
- [ ] Allow policy includes only the administrator identity.
- [ ] MFA authenticator/passkey enrolled and required by the application policy.
- [ ] `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAIL` configured in Pages.
- [ ] Anonymous `/admin` and `/admin/proyectos` requests are denied by Access.
- [ ] A different authenticated email is denied by the application.
- [ ] Sign out clears the Access session.
- [ ] Content and project edits are tested against local D1 first.
- [ ] Shared D1 is backed up before production content changes.
