# FOLIO — Svelte 5 design system

FOLIO is a reading-first component library: warm paper, near-black ink, a restrained red accent, typographic hierarchy and rules instead of elevation.

## Build and publish

From the repository root:

```sh
pnpm folio:build
cd packages/folio
npm pack
npm login
npm publish --access public
```

Inspect the tarball before publishing. Confirm the npm scope/name is available and bump this package's version for each release. Never publish from CI or commit npm credentials.

## Install and use

```sh
npm install @benitoanagua/folio
```

Import the stylesheet once:

```ts
import '@benitoanagua/folio/styles.css';
```

Then import components:

```svelte
<script>
	import { Button, Card, Badge } from '@benitoanagua/folio';
</script>

<Card title="Example">
	<Badge>Ready</Badge>
	<Button>Continue</Button>
</Card>
```

Svelte 5 is a peer dependency. Override the CSS custom properties after importing the stylesheet to theme a consuming app.

The portfolio and catalog use this same source via the `$folio` alias; the package build generates the npm `dist/` artifact.
