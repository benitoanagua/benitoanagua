# FOLIO — plan de calidad y evolución

**Estado:** ejecución incremental, sin migración de framework.  
**Alcance:** `packages/folio/` y `apps/catalog/`; el portfolio de `src/` permanece como aplicación consumidora.

## Decisión de arquitectura

FOLIO sigue siendo una librería pequeña, editorial y Svelte 5-native dentro del repositorio `benitoanagua`. STRATA sirve de referencia de prácticas (contratos, documentación y verificación), no como arquitectura que deba copiarse completa.

- Svelte 5 sigue siendo la implementación de componentes.
- CSS custom properties, temas y tokens son la capa compartible.
- El catálogo Svelte/Vite consume la fuente real de FOLIO.
- No migrar a Lit ni Stencil en esta etapa.
- No añadir paquetes, adaptadores o componentes sin un caso de uso comprobable.

## Estado verificado

- 13 componentes exportados desde `packages/folio/src/lib/index.ts`, más los tipos `PortfolioProject`, `ProjectCardLabels`, `SocialLink` y `TimelineEntry`.
- Tokens, tema, espaciado y utilidades en `packages/folio/src/lib/styles/`.
- Contraste comprobado sobre los pares de tokens de ambos temas: mínimo 4.79:1 (botón deshabilitado en tema claro), todos los pares de texto por encima de 4.5:1.
- Catálogo independiente en `apps/catalog/` con índice de API de los 13 componentes, snippet de uso, estados de Button/Notice/Divider y fixtures en español marcados con `lang="es"`.
- Harness y pruebas Playwright por componente en `e2e/folio/`.
- CI ejecuta checks Svelte, lint/Prettier, validación de contenido y diseño, builds, empaquetado, consumidor aislado y pruebas E2E.
- Última ejecución verde conocida: CI `45538225113` sobre `6c91bfd` (Validate application + E2E tests).
- La ejecución `45500083413` sobre `c13eb31` falló en `prettier --check` por los scripts de empaquetado; esa causa quedó corregida y confirmada en verde en `45538225113`, que incluye `folio:pack:check` y `folio:consumer:check` dentro de "Static checks".

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
- [x] Exportar los tipos de props desde la entrada del paquete y comprobarlos con `tsc` en el smoke de consumidor.
- [ ] Completar revisión manual de zoom 200%, teclado y contraste en navegadores reales.
- [ ] Mantener APIs simples y compatibles; cualquier breaking change requiere versión y nota de migración.

### Fase 3 — Catálogo

- [x] Añadir índice de API de los 13 componentes y props/defaults principales.
- [x] Añadir ejemplos disabled/loading, input etiquetado y contenido largo.
- [x] Añadir pruebas axe en tema claro/oscuro y navegación de teclado.
- [x] Corregir el markup de navegación que contenía secuencias escapadas visibles.
- [x] Añadir snippet de uso y completar estados de Button, Notice y Divider.
- [x] Marcar con `lang="es"` el contenido en español (WCAG 3.1.2).
- [x] Confirmar en CI la navegación corregida y el test de reflow a 320 px (ejecución `45500083413`, job E2E).
- [ ] Revisión visual/manual de accesibilidad y zoom.

### Fase 4 — Distribución

- [x] Build del paquete y smoke check del tarball integrados en CI.
- [x] Verificar en el manifest los exports JS/Svelte, tipos, CSS y peer dependency Svelte 5.
- [x] Añadir prueba automatizada que instala el tarball en un proyecto temporal Svelte 5 y ejecuta Vite build.
- [x] El smoke de consumidor comprueba además que el bundle contiene el componente y que `tsc --noEmit` resuelve los tipos publicados.
- [x] Confirmar que la prueba de consumidor aislado pasa en CI (ejecución `45538225113`, job "Validate application").
- [ ] Publicar manualmente una versión cuando el paquete y catálogo estén validados; nunca publicar automáticamente desde CI.

### Fase 5 — Correcciones de la última iteración

- [x] `scripts/validate-folio-pack.mjs` y `scripts/test-folio-consumer.mjs` admiten la salida de `npm pack --json` de npm ≤11 (array) y npm ≥12 (objeto).
- [x] Badge: el punto inicial pasa de `::before` a un `<span aria-hidden>`, fuera del nombre accesible.
- [x] ProjectCard: la etiqueta de `tags` deja de usar `aria-label` sobre un `<p>` y pasa a texto oculto con `.ds-visually-hidden`.
- [x] Timeline: `role="list"` explícito para conservar la semántica en Safari.
- [x] Nueva utilidad `.ds-visually-hidden` y token `--font-mono` en FOLIO.
- [x] Catálogo: contenido en español envuelto en `lang="es"`; snippet de uso y estados completos.
- [x] Pruebas E2E actualizadas para cada corrección (badge, tags, role de lista, estados del catálogo).

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

## Notas de entorno

- En local, la suite completa debe ejecutarse con pocos workers (`pnpm exec playwright test --workers=2`). Con el máximo por defecto la máquina se satura y aparecen timeouts falsos en `axe` y `page.goto`; en CI ya se usan 2 workers.
- Un `vite preview` huérfano en el puerto 5174 sirve un build antiguo del catálogo y hace fallar `e2e:folio`. Antes de repetir la suite local, comprobar que el puerto está libre.

## Próximo paso

CI quedó en verde sobre el commit final (`6c91bfd`, ejecución `45538225113`). Queda completar la revisión manual de zoom 200%, teclado y contraste en navegadores reales y, tras eso, publicar una versión manual del paquete. Mantener FOLIO deliberadamente pequeño.
