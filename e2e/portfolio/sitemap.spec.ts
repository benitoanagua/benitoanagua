import { expect, test } from '../support/test';

test('sitemap is served as runtime XML and includes core public routes', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.ok()).toBeTruthy();
	expect(response.headers()['content-type']).toContain('application/xml');

	const xml = await response.text();
	expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
	expect(xml).toContain('<urlset');
	for (const path of ['/', '/habilidades', '/proyectos', '/experiencia', '/cv']) {
		expect(xml).toContain(`<loc>https://benitoanagua.pages.dev${path}</loc>`);
	}

	const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
	expect(locations.length).toBeGreaterThan(5);
	expect(new Set(locations).size).toBe(locations.length);
});
