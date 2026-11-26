// All public pages read editable content from D1 at request time, so nothing
// can be prerendered at build time (the binding only exists in the
// Cloudflare runtime). Child routes may still declare `prerender = false`
// explicitly for documentation purposes.
export const prerender = false;
