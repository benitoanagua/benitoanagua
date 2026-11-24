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

## Estado verificado en el repositorio

- 13 componentes exportados desde `packages/folio/src/lib/index.ts`.
- Tokens, tema, espaciado y utilidades en `packages/folio/src/lib/styles/`.
- Catálogo independiente en `apps/catalog/`.
- Harness y pruebas Playwright por componente en `e2e/folio/`.
- `pnpm check:all`, lint, validación de diseño, build de portfolio, build de paquete y build de catálogo están incorporados al CI.
- El paquete `@benitoanagua/folio` está preparado para empaquetado/publicación; la documentación del repositorio marca la publicación como pendiente.

## Fases

### Fase 1 — Correcciones de calidad (en curso)

- [x] Corregir la variante `outline` de Button: borde visible y estado hover consistente.
- [x] Corregir Divider `thick` y `double`: utilizar grosor y estilo distintos.
- [x] Añadir pruebas E2E que protejan esos contratos visuales.
- [ ] Ejecutar CI y resolver cualquier regresión detectada.

### Fase 2 — Contratos de componentes

- [x] Auditar los 13 componentes contra la Constitución de lectura y registrar hallazgos en `packages/folio/COMPONENTS.md`.
- [x] Documentar props/defaults, contenido/snippets, semántica, ejemplos y límites conocidos en `packages/folio/COMPONENTS.md`.
- [x] Añadir fixture de texto largo y español, navegación por teclado, foco visible y reduced motion; 200% zoom requiere comprobación manual/visual.
- [ ] Mantener APIs simples y compatibles; cualquier breaking change requiere versión y nota de migración.

### Fase 3 — Catálogo

- [x] Mostrar un índice navegable de los 13 componentes y sus props/defaults principales en el catálogo, alineado con `COMPONENTS.md`.
- [x] Añadir estados disabled/loading, input etiquetado y contenido largo en español.
- [x] Enlazar y describir requisitos de accesibilidad en la referencia de contratos.
- [x] Añadir pruebas E2E de navegación API, teclado/foco, estados y reduced motion; conservar axe en temas claro/oscuro.\n- [ ] Confirmar ejecución CI y revisar resultado axe/teclado real.

### Fase 4 — Distribución

- [ ] Verificar `pnpm folio:build` y revisar el contenido de `npm pack`.
- [ ] Confirmar exports, declaraciones de tipos, CSS y peer dependency Svelte 5.
- [ ] Probar instalación en un proyecto Svelte 5 mínimo separado.
- [ ] Publicar manualmente una versión cuando el paquete y el catálogo estén validados; nunca publicar automáticamente desde CI.

## Criterios de aceptación

- `pnpm check:all`, `pnpm lint`, `pnpm check:design`, `pnpm build`, `pnpm folio:build` y `pnpm catalog:build` pasan.
- Las pruebas `e2e:folio` y `e2e:catalog` pasan.
- No se rompe el portfolio, sus rutas, contenido, tema ni despliegue Cloudflare.
- No se introduce una dependencia de Lit/Stencil ni una reescritura del portfolio.
- Los cambios visuales respetan `docs/design/constitucion-lectura.md`.

## Avance posterior a PR #11

- PR #11 integrada en `main` (squash): `a106ce0d15c9993667dbe8952542786ff4b3b8fc`.
- Se añadió `packages/folio/COMPONENTS.md` con contratos de los 13 componentes y hallazgos de accesibilidad.\n- El catálogo ahora incluye índice API y fixtures de lectura; se añadieron utilidades globales de foco visible y reduced motion.
- El CI de validación en main detectó un fixture de Playwright con argumento no utilizado; corregido en el commit `5c66e5c9cfa2ce43305b0e984017acc8006cc2cb`. Esperar la nueva ejecución completa antes de cerrar la fase.

## Próximo paso

Completar la referencia navegable en el catálogo, añadir pruebas de reflow/teclado/estados y validar el paquete sin publicar automáticamente. Mantener el sistema deliberadamente pequeño.
