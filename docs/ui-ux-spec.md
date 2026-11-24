# Especificación UI/UX del portafolio

Estado: vigente · 2026-11-24. Complementa `docs/adr/0002-svelte-native-design-system.md`.
Este documento es la referencia para decidir cómo se ve y cómo se comporta el sitio. Si el código y este documento difieren, se corrige uno de los dos en el mismo cambio.

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

- Todo texto de interfaz proviene de `site.{es,en}.toml` (navegación, portada, pie) o de `projects-copy.ts` (proyectos). No se escriben ternarios `lang.current === 'en' ? … : …` en las páginas.
- Español e inglés se mantienen alineados en estructura y significado. `pnpm check:content` valida estructura, no redacción.
- `<html lang>` se sincroniza con el idioma activo. El HTML prerenderizado es español.
- Texto visible en lenguaje natural. No se usan identificadores internos (`SNAKE_CASE`, `::OK`, `//`) como texto de interfaz: no se traducen, no los entienden los lectores de pantalla y no informan al visitante.
- Sin cifras, clientes ni resultados inventados (ver `SKILLS_CONTENT_GUIDE.md`).

## 4. Fundamentos visuales

Identidad: "contorno arquitectónico" (bordes finos, rejilla compartida, acento primario). Se conserva; se simplifica su texto, no su estructura.

**Tipografía** (cargada una sola vez desde `src/app.html`, con `display=swap`; los iconos usan `display=block`):

| Fuente                           | Rol                                                   |
| -------------------------------- | ----------------------------------------------------- |
| Archivo Black (`--font-display`) | Solo el nombre en la portada                          |
| Sora (`--font-body`)             | Texto corrido                                         |
| Inter (`--font-sans`)            | Componentes del design system                         |
| JetBrains Mono (`--font-mono`)   | Etiquetas cortas y datos (años, estados, tecnologías) |

Reglas: la fuente mono no se usa para frases largas. Las etiquetas no se escriben en mayúsculas forzadas por código salvo el nombre en el logotipo. Líneas de texto de menos de 80 caracteres.

**Espaciado, líneas y contenedores:** solo tokens de `app.css` y `tokens.css` (`--space-*`, `--line-*`, `--container-*`). No se escriben valores sueltos en componentes nuevos.

**Color:** solo variables `--color-*` del tema Material. Claro y oscuro obligatorios; el tema inicial respeta la preferencia del sistema y se recuerda en `localStorage`.

**Movimiento:** solo para responder a una acción del visitante. Se respeta `prefers-reduced-motion`. No hay animaciones decorativas continuas nuevas.

## 5. Componentes

Catálogo (`src/lib/design-system`): `Button`, `Badge`, `Card`, `Divider`, `TextField`, `SectionHeading`, `Timeline`, `Metric`, `SocialLinks`, `ProjectCard`.

Reglas:

- Un componente de presentación reutilizable vive en el design system y no contiene texto de idioma fijo: recibe etiquetas por props (ejemplo: `ProjectCard` acepta `labels`).
- `src/lib/components/ProjectCard.svelte` (tarjeta del sitio, con datos de `Project`) y `design-system/ProjectCard.svelte` (genérica) coexisten de forma temporal. Siguiente paso: que la tarjeta del sitio use la del design system y se elimine la duplicada.
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
- Barra superior fija; con enlace "Saltar al contenido" como primer elemento enfocable.
- Cambio de idioma y de tema: dos botones agrupados, siempre visibles, con `aria-label` localizado.
- Puntos de corte: 640, 768 y 1024px. Se diseña de móvil hacia arriba.

## 8. Accesibilidad (criterios verificables)

- Objetivo táctil mínimo de 44×44px en menú móvil, idioma y tema.
- Foco visible en todo elemento interactivo (`outline` de 3px con color primario).
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
pnpm run build
```

Revisión manual: portada y una página de detalle en 360px y 1280px, en ambos temas y ambos idiomas; recorrer el menú solo con teclado.

## 11. Pendientes conocidos

- Unificar las dos `ProjectCard` (sección 5).
- Campo de imagen en `Project` y estado definido para tarjetas sin imagen.
- Resolver los avisos de `svelte-check` por CSS sin usar en `src/routes/+page.svelte` (`.path-*`, `.card-footer`).
- Textos de SEO por página todavía en inglés fijo en algunas rutas.
