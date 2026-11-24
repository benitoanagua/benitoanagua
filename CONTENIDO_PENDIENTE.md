# Contenido pendiente de confirmar (proyectos)

Los 15 proyectos de `projects.*.toml` salen de dos fuentes: tus CV (proyectos independientes) y lo que has contado de tus repositorios. No añadí métricas, clientes ni resultados. Revisa antes de publicar:

## Datos que no tengo (la página oculta lo que falta)
- `links` (repo, demo, caso de estudio): **ninguno** de los 15 los tiene todavía.
- `result`: ninguno. Añádelo solo cuando haya algo comprobable.
- Capturas o diagramas: el modelo aún no tiene campo de imagen; dime si lo quieres.

## Proyectos a confirmar (descripciones breves, hechas con lo poco que sé)
| Slug | Qué confirmar |
|---|---|
| `palm`, `bench` | ¿Son públicos? ¿Se distinguen entre sí? Si no, deja solo `palm`. Año y estado ("en desarrollo"). |
| `agendaqr` | Qué hace la app (ahora solo dice stack y backend). |
| `maniobra` | ¿Quieres publicar que es tu primer paso hacia los juegos de mesa indie (campo `context`)? |
| `transcriptor` | ¿Es público o de uso personal? |
| `rescatados` | ¿Puede mencionarse públicamente? Está solo en especificación. |
| `soporte-erp` | Describe método de trabajo, sin datos de cliente. Confirma que MAMAYATECH acepta nombrarse. |
| `fintech-android`, `whatsapp-chatbots`, `ecommerce-woocommerce`, `ux-movil-flutter`, `identidad-visual`, `design-system-figma`, `flujos-ia`, `ia-generativa-diseno` | Vienen de tus CV; faltan nombre real del proyecto (si lo hay), enlaces y evidencia visual. |

## Habilidades de proyectos sin ficha en `/habilidades`
`pnpm check:content` las lista (Supabase, Fly.io, Kotlin Multiplatform, Firestore, Elementor, Adobe Illustrator…). Para que tengan página, añádelas a `[[focuses.skills]]` en `cv.es.toml` y `cv.en.toml` (tu flujo habitual).

## Pendientes ya existentes en tu versión (no los toqué)
- 16 avisos de `svelte-check` por CSS sin usar en `src/routes/+page.svelte` (`.path-*`, `.card-footer`).
- Textos de portada y SEO en inglés hardcodeados en varias páginas; la portada y el SEO se prerenderizan en español.
