import { test as base, expect } from '@playwright/test';

/**
 * Shared test fixture. Extend `base` here when a cross-cutting behaviour
 * (auth state, route mocks, locale overrides) is needed by several specs.
 */
export const test = base.extend({});

export { expect };
