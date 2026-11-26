/**
 * Local-only admin test credentials. The value is bound to the Playwright
 * webServer and is only honoured for loopback requests by `requireAdmin`.
 */
export const ADMIN_E2E_SECRET = 'local-e2e-admin-secret-please-never-deploy-this-value';
export const ADMIN_E2E_HEADER = 'x-admin-e2e-secret';
