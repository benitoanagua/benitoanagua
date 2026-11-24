# Especificación UI/UX del portafolio

Estado: vigente · 2026-11-24. Complementa `docs/adr/0002-svelte-native-design-system.md` y `docs/adr/0003-folio-reading-design-system.md`.
Este documento es la referencia para decidir cómo se ve y cómo se comporta el sitio. Si el código y este documento difieren, se corrige uno de los dos en el mismo cambio.
La norma superior es `docs/constitucion-lectura.md`: donde esta especificación y la Constitución entren en conflicto, prevalece la Constitución (ver ADR 0003).

## 1. Propósito y público

El sitio demuestra capacidades profesionales con evidencia (experiencia y proyectos). Públicos, por orden de prioridad:

1. Reclutadores y responsables de contratación: necesitan entender el perfil en menos de 30 segundos y llegar al CV.
2. Clientes potenciales: necesitan ver proyectos concretos y una vía de contacto.
3. Estudiantes y colegas: exploran habilidades y proyectos con más calma.

Trabajo principal de cada página: la portada orienta, `/habilidades` y `/proyectos` permiten explorar, `/experiencia` da contexto, `/cv` entrega el documento.

## 2. Arquitectura de información

| Ruta                                  | Función                     | Entrada principal                                                         |
| ------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `/`                                   | Orientar y derivar          | Tres accesos (habilidades, experiencia, proyectos) y proyectos destacados |
| `/habilidades`, `/habilidades/[slug]` | Capacidades con evidencia   | Menú                                                                      |
| `/proyectos`, `/proyectos/[slug]`     | Evidencia concreta          | Menú, portada, página de habilidad                                        |
| `/experiencia`                        | Línea de tiempo profesional | Menú                                                                      |
| `/cv`                                 | Descarga de PDF por perfil  | Menú                                                                      |

Reglas:

- El menú principal tiene un único origen: `src/lib/data/nav.ts`. No se duplican enlaces en cabeceras ni en CTA.
- Cada enlace del menú aparece una sola vez en la cabecera. No hay un segundo botón hacia `/cv`.
- Cada página de proyecto enlaza a las habilidades que aplica, y cada página de habilidad lista sus proyectos.

## 3. Idioma y contenido

- Todo texto de interfaz proviene de `site.{es,en}.toml` (navegación, portada, pie) `ui-copy.ts` (habilidades, experiencia, CV, errores) o `projects-copy.ts` (proyectos). No se escriben ternarios `lang.current === 'en' ? … : …` en las páginas.
- Español e inglés se mantienen alineados en estructura y significado. `pnpm check:content` valida estructura, no redacción.
- `<html lang>` se sincroniza con el idioma activo. El HTML prerenderizado es español.
- Texto visible en lenguaje natural. No se usan identificadores internos (`SNAKE_CASE`, `::OK`, `//`) como texto de interfaz: no se traducen, no los entienden los lectores de pantalla y no informan al visitante.
- Sin cifras, clientes ni resultados inventados (ver `SKILLS_CONTENT_GUIDE.md`).

## 4. Fundamentos visuales

Identidad: **FOLIO**, sistema de lectura tipográfica derivado de la estructura de Strata (filetes, sin elevación, tinta sobre papel). Papel cálido, tinta casi negra y un único acento rojo de corrector. Sustituye a la identidad «contorno arquitectónico» (ver ADR 0003); se conserva la lógica de bordes finos y rejilla compartida en forma de filetes.

**Tipografía** (cargada una sola vez desde `src/app.html`, con `display=swap`; los iconos usan `display=block`):

| Fuente                              | Rol                                        |
| ----------------------------------- | ------------------------------------------ |
| Playfair Display (`--font-display`) | Títulos y display                          |
| Vollkorn (`--font-body`)            | Texto corrido                              |
| Mulish (`--font-ui`)                | Interfaz: etiquetas, controles, navegación |

No hay fuente monoespaciada. Las antiguas etiquetas `mono` usan la clase `.meta`. Los tamaños viven en `packages/folio/src/lib/styles/tokens.css` (`--text-*`); el mínimo absoluto de cualquier texto es `1rem`, también en etiquetas y metadatos (Constitución, Art. 4). Las mayúsculas por código solo se permiten en los roles de etiqueta corta `.kicker`, `.meta` y `.label`, y en el logotipo; nunca en títulos ni texto corrido. Líneas de texto de 40–75 caracteres (medida por defecto `65ch`).

**Espaciado, filetes y contenedores:** tokens de `packages/folio/src/lib/styles/spacing.css`, `tokens.css` y `utilities.css` (`--space-*`, `--rule-*`, `--container-*`, `--radius-sm`). No se escriben valores sueltos en componentes nuevos. Radios de 0 a 2px; sin píldoras ni círculos decorativos.

**Color:** solo variables `--color-*` de `packages/folio/src/lib/styles/theme.css` (nombres Material conservados como contrato, valores FOLIO). Claro y oscuro obligatorios; el tema inicial respeta la preferencia del sistema y se recuerda en `localStorage`. El acento `--color-primary` se reserva para enlaces, foco, kickers, estado activo y la palabra en cursiva del título; los usos decorativos usan tinta o filetes. `pnpm run check:design` verifica contraste WCAG en ambos temas.

**Movimiento:** solo respuesta a una acción del visitante, con `--duration-fast`/`--duration-base`. Se respeta `prefers-reduced-motion`. No hay transformaciones decorativas (`scale` en `:active` está prohibido) ni animaciones continuas nuevas. La elevación (`box-shadow`) está abolida: la separación se hace con filetes, espacio y superficies tonales.

**Foco:** `outline: 3px solid var(--color-primary)` con `outline-offset: 3px` en `:focus-visible` (en alto contraste, contorno del sistema).

## 5. Componentes

Catálogo (`packages/folio/src/lib`, 13 componentes): `Button`, `Badge`, `Card`, `Divider`, `TextField`, `SectionHeading`, `Timeline`, `Metric`, `SocialLinks`, `ProjectCard`, `Notice`, `Pullquote`, `Marginalia`. Sus usos reales: `Notice` para el aviso de idioma de los PDF en `/cv`, `Pullquote` para frases destacadas de proyectos/habilidades, `Marginalia` para la columna de metadatos de las páginas de detalle.

Reglas:

- Un componente de presentación reutilizable vive en el design system y no contiene texto de idioma fijo: recibe etiquetas por props (ejemplo: `ProjectCard` acepta `labels`).
- `src/lib/components/ProjectCard.svelte` es una tarjeta de feature enlazada a rutas y datos del portafolio. `packages/folio/src/lib/components/ProjectCard.svelte` es la tarjeta genérica del paquete; tienen contratos diferentes y no se consideran duplicadas hasta que compartan el mismo modelo y API.
- Todo componente interactivo define estados: reposo, hover, foco visible, activo y deshabilitado.

Estados de contenido de una tarjeta de proyecto:

| Dato ausente  | Comportamiento                           |
| ------------- | ---------------------------------------- |
| `links`       | Se oculta el bloque de enlaces           |
| `result`      | Se oculta la sección de resultado        |
| Imagen        | Sin hueco: la tarjeta solo muestra texto |
| `stack` vacío | Se oculta la lista de tecnologías        |

## 6. Patrones de página

- **Portada:** nombre, una frase de valor, tres accesos y proyectos destacados. Contacto y formación al final. Un único elemento memorable (el nombre en la cabecera); el resto es sobrio.
- **Listas** (`/habilidades`, `/proyectos`): filtros por categoría o área, el filtro activo se refleja en la URL (`?area=`).
- **Detalle:** título, contexto, evidencia, enlaces relacionados. Cada detalle ofrece vuelta a la lista.
- **Pie:** identidad, enlaces y contacto. Sin texto decorativo.

## 7. Navegación y responsive

- Escritorio (≥1024px): menú en la barra superior. Debajo de ese ancho: tira de navegación bajo la barra con desplazamiento horizontal y degradado en el borde derecho que indica que hay más enlaces.
- Eslogan doble de filetes sobre la barra fija: filete doble arriba, filete hairline abajo; el nombre en `--font-display` con mayúsculas (único uso de mayúsculas fuera de las etiquetas); la línea de rol en `.meta`; nav a la derecha en escritorio y tira con degradado en móvil.
- Cambio de idioma y de tema: dos botones agrupados, siempre visibles, con `aria-label` localizado.
- Puntos de corte: 640, 768 y 1024px. Se diseña de móvil hacia arriba.

## 7b. Exploración y orientación

- **Habilidades:** búsqueda por nombre, categoría o área profesional (sin tildes ni mayúsculas) y salto directo a cada categoría. El número de resultados se anuncia con `aria-live`. Si no hay resultados, se dice qué se buscó y se ofrece limpiar la búsqueda.
- **Experiencia:** cada área profesional muestra las habilidades de esa área como enlaces directos. No hay enlaces genéricos repetidos por puesto.
- **Detalle de habilidad:** evidencia, proyectos relacionados, otras habilidades de la misma categoría y un siguiente paso claro (CV o contacto). Ninguna página termina sin una acción.
- **Detalle de proyecto:** vuelve a la lista y propone proyectos relacionados.
- **CV:** el idioma de los PDF se indica antes de la descarga. Si la interfaz está en inglés se avisa que los documentos están en español.
- **Página de error:** `+error.svelte` explica qué pasó en lenguaje claro y ofrece inicio y secciones principales. No se indexa.

## 8. Accesibilidad (criterios verificables)

- Objetivo táctil mínimo de 48px de alto en controles (44px como piso absoluto) en menú móvil, idioma, tema, filtros, chips de habilidades y botones de acción.
- Tamaño mínimo de texto de 1rem (16px) en todo texto, también en etiquetas y metadatos.
- Foco visible por `outline` de 3px con desplazamiento de 3px en todo elemento interactivo (en modo de alto contraste, contorno del sistema).
- Los saltos a anclas descuentan la barra fija (`scroll-padding-top`).
- Contraste mínimo WCAG AA (4.5:1 texto normal, 3:1 texto grande y componentes).
- Un solo `h1` por página; jerarquía de encabezados sin saltos.
- Landmarks: `header`, `nav` con `aria-label`, `main#main`, `footer`.
- Enlaces externos con `rel="noopener"`.
- Sin información transmitida solo por color.
- Funciona con teclado y con `prefers-reduced-motion`.

## 9. Rendimiento

- Fuentes: `preconnect`, una solicitud para las familias de texto y otra para iconos; sin `@import` en CSS.
- Imágenes: `loading="lazy"` y dimensiones definidas para evitar saltos de diseño.
- Sitio estático prerenderizado; sin dependencias nuevas sin justificar.

## 10. Verificación antes de unir un cambio

```sh
pnpm run check
pnpm run lint
pnpm run check:content
pnpm run check:design
pnpm run build
```

`check:design` ejecuta `scripts/validate-design.ts`: verifica tamaño mínimo de texto, radios, sombras, literales de color/fuente, mayúsculas fuera de los roles permitidos y contraste WCAG en ambos temas. Una violación bloquea la compilación (el script también corre dentro de `build`).

Revisión manual: portada y una página de detalle en 360px y 1280px, en ambos temas y ambos idiomas; recorrer el menú solo con teclado.

## 11. Pendientes conocidos

- Unificar las dos `ProjectCard` (sección 5).
- Campo de imagen en `Project` y estado definido para tarjetas sin imagen.
- Anclas de categoría en `/habilidades` dependen del idioma; si se quiere enlazar a una categoría desde otra página hace falta un identificador estable por categoría.
- El idioma se resuelve en el navegador: un visitante con navegador en inglés ve primero el HTML en español y luego cambia.
- Textos de SEO por página todavía en inglés fijo en algunas rutas.
