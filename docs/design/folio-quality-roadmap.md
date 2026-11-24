# FOLIO — plan de calidad y evolución

**Estado:** ejecución incremental, sin migración de framework.  
**Alcance:** `packages/folio/` y `apps/catalog/`; el portfolio de `src/` permanece como aplicación consumidora.

## Decisión de arquitectura

FOLIO sigue siendo una librería pequeña, editorial y Svelte 5-native dentro del repositorio `benitoanagua`. STRATA sirve como referencia de prácticas (contratos, documentación y verificación), no como arquitectura que deba copiarse completa.

- Svelte 5 sigue siendo la implementación de componentes.
- CSS custom properties, temas y tokens son la capa compartible.
- El catálogo Svelte/Vite consume la fuente real de FOLIO.
- No migrar a Lit ni Stencil en esta etapa.
- No añadir paquetes, adaptadores o componentes sin un caso de uso comprobable.

## Estado verificado

- 13 componentes exportados desde `packages/folio/src/lib/index.ts`.
- Tokens, tema, espaciado y utilidades en `packages/folio/src/lib/styles/`.
- Catálogo independiente en `apps/catalog/`.
- Harness y pruebas Playwright por componente en `e2e/folio/`.
- CI ejecuta checks Svelte, lint/Prettier, validación de contenido y diseño, builds y pruebas E2E.
- CI #62 completó `success` sobre `625db6192e0d15e7455ce76d44c636b689a2f4c2`. Los cambios posteriores de catálogo y consumo aislado están pendientes de una nueva ejecución.

## Fases

### Fase 1 — Correcciones de calidad (completada)

- [x] Corregir Button `outline`: borde visible y hover consistente.
- [x] Corregir Divider `thick` y `double`: grosor y estilo diferenciados.
- [x] Añadir pruebas E2E para proteger los contratos visuales.
- [x] CI pasó en la ejecución #62.

### Fase 2 — Contratos de componentes

- [x] Auditar los 13 componentes contra la Constitución de lectura.
- [x] Documentar props/defaults, contenido/snippets, semántica, ejemplos y límites en `packages/folio/COMPONENTS.md`.
- [x] Añadir fixtures de español, texto largo, foco visible y reduced motion.
- [ ] Completar revisión manual de zoom 200%, teclado y contraste en navegadores reales.
- [ ] Mantener APIs simples y compatibles; cualquier breaking change requiere versión y nota de migración.

### Fase 3 — Catálogo

- [x] Añadir índice de API de los 13 componentes y props/defaults principales.
- [x] Añadir ejemplos disabled/loading, input etiquetado y contenido largo.
- [x] Añadir pruebas axe en tema claro/oscuro y navegación de teclado.
- [x] Corregir el markup de navegación que contenía secuencias escapadas visibles.
- [ ] Confirmar en CI la navegación corregida y el test de reflow a 320 px.
- [ ] Revisión visual/manual de accesibilidad y zoom.

### Fase 4 — Distribución

- [x] Build del paquete y smoke check del tarball integrados en CI.
- [x] Verificar en el manifest los exports JS/Svelte, tipos, CSS y peer dependency Svelte 5.
- [x] Añadir prueba automatizada que instala el tarball en un proyecto temporal Svelte 5 y ejecuta Vite build.
- [ ] Confirmar que la prueba de consumidor aislado pasa en CI.
- [ ] Publicar manualmente una versión cuando el paquete y catálogo estén validados; nunca publicar automáticamente desde CI.

## Criterios de aceptación

- `pnpm check:all`, `pnpm lint`, `pnpm check:design`, `pnpm build`, `pnpm folio:build` y `pnpm catalog:build` pasan.
- `pnpm folio:pack:check` y `pnpm folio:consumer:check` pasan.
- Las pruebas `e2e:folio` y `e2e:catalog` pasan.
- No se rompe el portfolio, sus rutas, contenido, tema ni despliegue Cloudflare.
- No se introduce una dependencia de Lit/Stencil ni una reescritura del portfolio.
- Los cambios visuales respetan `docs/design/constitucion-lectura.md`.

## Avance posterior a PR #11

- PR #11 integrada en `main` (squash): `a106ce0d15c9993667dbe8952542786ff4b3b8fc`.
- Se añadió `packages/folio/COMPONENTS.md` con contratos de los 13 componentes y hallazgos de accesibilidad.
- El catálogo incluye índice de API y fixtures de lectura; las utilidades globales de FOLIO ofrecen foco visible y soporte para reduced motion.
- Se incorporó `pnpm folio:pack:check` al script `build:all` y al CI.
- Se añadió `pnpm folio:consumer:check`, que prueba el paquete empacado en una app Svelte 5 aislada.
- No se publica el paquete automáticamente; la publicación continúa siendo manual.

## Próximo paso

Esperar CI de los últimos cambios, corregir cualquier regresión y completar la revisión manual de zoom/teclado/contraste. Mantener FOLIO deliberadamente pequeño.
