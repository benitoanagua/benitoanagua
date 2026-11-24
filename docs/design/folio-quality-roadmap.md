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

- [ ] Auditar los 13 componentes contra la Constitución de lectura.
- [ ] Documentar para cada componente: propósito, props, valores por defecto, estados, eventos, slots/snippets, semántica y ejemplos.
- [ ] Revisar texto largo, español acentuado, zoom 200%, teclado, foco y reduced motion.
- [ ] Mantener APIs simples y compatibles; cualquier breaking change requiere versión y nota de migración.

### Fase 3 — Catálogo

- [ ] Mostrar propiedades y variantes reales de cada componente, sin duplicar una API ficticia.
- [ ] Añadir ejemplos de estados y contenido límite.
- [ ] Mostrar requisitos de accesibilidad y tokens relacionados.
- [ ] Verificar navegación por teclado, encabezados, enlaces y tema claro/oscuro.

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

## Próximo paso

Completar la auditoría componente por componente y mejorar la documentación del catálogo antes de ampliar el inventario. Mantener el sistema deliberadamente pequeño.
