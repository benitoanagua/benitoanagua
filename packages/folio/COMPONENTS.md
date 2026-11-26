# FOLIO — contratos de componentes

Referencia de API para la versión fuente actual. Se documentan los valores observados en los componentes Svelte; cualquier cambio de API debe actualizar esta página y sus ejemplos.

## Convenciones

- Componentes Svelte 5; el contenido se entrega mediante children/snippets, salvo que se indique.
- Los textos de ejemplo son ilustrativos. El consumidor debe aportar contenido real y traducciones.
- Los controles deben conservar etiquetas textuales, foco visible, orden DOM lógico y reflow al ampliar.
- No se deben usar variantes de color como único indicador de estado.

## API

| Componente       | Props requeridas | Props opcionales / defaults                                                                                                                                                      | Contenido / contrato                                                                                                                                |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ActionLink`    | `title`, `description`, `href` | `actionLabel='Explore section'` | Enlace nativo con título, descripción y acción textual; href debe ser un destino válido y el texto describe el destino |
| `Badge`          | —                | `tone='neutral'`; `neutral\|success\|warning\|danger`                                                                                                                            | children; indicador textual en línea; el punto inicial es decorativo y `aria-hidden`                                                                |
| `Button`         | —                | `variant='primary'` (`primary\|secondary\|outline\|ghost`), `size='md'` (`sm\|md\|lg`), `disabled=false`, `loading=false`, `onclick`                                             | children; botón nativo; loading deshabilita y establece `aria-busy`                                                                                 |
| `Card`           | —                | `title`                                                                                                                                                                          | children; contenedor de contenido sin elevación                                                                                                     |
| `Divider`        | —                | `orientation='horizontal'` (`horizontal\|vertical`), `variant='soft'` (`hair\|soft\|thick\|double\|space`), `label`                                                              | No admite children; `space` es decorativo; reglas usan `role=separator`                                                                             |
| `Flex`           | —                | `direction='column'` (`row\|column`), `align='stretch'`, `justify='start'`, `wrap='nowrap'`, `gap='4'`, `rowGap`, `columnGap`, `padding='none'`, `paddingBlock`, `paddingInline` | children; contenedor flex con control de dirección, alineación, justificación, gap y padding usando tokens de espaciado                             |
| `Marginalia`     | `aside`          | —                                                                                                                                                                                | children y snippet `aside`; el DOM coloca primero el aside y después el cuerpo                                                                      |
| `Metric`         | `value`, `label` | `note`                                                                                                                                                                           | Sin children; usar valor verificable y etiqueta comprensible                                                                                        |
| `Notice`         | `label`          | `tone='note'` (`note\|success\|warning\|error`)                                                                                                                                  | children; error usa `role=alert`, otros tonos `role=status`                                                                                         |
| `PageHeader`    | `title`          | `eyebrow`, `description`, `level=1` (`1\|2\|3`) | Encabezado de página con h1/h2/h3 nativo; usar el nivel que mantiene la jerarquía del documento |
| `ProjectCard`    | `project`        | `labels` (View, View case study, Source, Technologies)                                                                                                                           | `project: {title, description, href, image?, imageAlt?, year?, category?, tags?, sourceHref?}`; el grupo `tags` lleva etiqueta oculta `labels.tech` |
| `Pullquote`      | —                | `cite`                                                                                                                                                                           | children; blockquote y cite opcional                                                                                                                |
| `SectionHeading` | `title`          | `eyebrow`, `description`, `align='left'` (`left\|center`), `level=2` (`2\|3`), `rule=false`                                                                                      | Renderiza h2 o h3 según level; nivel debe respetar la jerarquía del documento                                                                       |
| `SocialLinks`    | `items`          | `compact=false`, `label='Social and professional links'`                                                                                                                         | `items: {label, href}[]`; nav con nombre accesible; enlaces externos abren nueva pestaña                                                            |
| `TextField`      | `label`, `id`    | `value=''` bindable, `placeholder=''`, `hint`, `type='text'`, `error`                                                                                                            | Campo input con label visible; error/hint se asocia por `aria-describedby`; error establece `aria-invalid`                                          |
| `Timeline`       | `items`          | —                                                                                                                                                                                | `items: {period, title, organization?, description?, href?}[]`; lista ordenada con `role=list`; título h3                                           |

## Tipos exportados

Además de los componentes, `@benitoanagua/folio` exporta los contratos de datos de sus props:

| Tipo                | Componente    | Definición                                                                            |
| ------------------- | ------------- | ------------------------------------------------------------------------------------- |
| `PortfolioProject`  | `ProjectCard` | `{title, description, href, image?, imageAlt?, year?, category?, tags?, sourceHref?}` |
| `ProjectCardLabels` | `ProjectCard` | `{view, case, source, tech}`                                                          |
| `SocialLink`        | `SocialLinks` | `{label, href}`                                                                       |
| `TimelineEntry`     | `Timeline`    | `{period, title, organization?, description?, href?}`                                 |

```ts
import type { PortfolioProject, TimelineEntry } from '@benitoanagua/folio';
```

Los tipos se comprueban en el smoke test de consumidor (`pnpm folio:consumer:check`), que importa la API pública, ejecuta `tsc --noEmit` y compila con Vite.

## Eventos

- `Button` acepta `onclick={(e: MouseEvent) => void}`. El resto de componentes no emiten eventos: son presentacionales.
- `TextField` expone `value` mediante `bind:value`.

## Auditoría de accesibilidad y límites conocidos

| Área                      | Estado / seguimiento                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                    | Usa botón nativo, disabled y aria-busy. El spinner respeta `prefers-reduced-motion`. Sin prop `type`: mantiene el valor nativo `submit`, así que dentro de un `<form>` envía el formulario. Revisar que el texto visible describa la acción también en loading. |
| TextField                 | Label visible persistente, hint/error vinculados y aria-invalid. `type` actualmente acepta string; el consumidor debe usar tipos HTML válidos.                                                                                                                  |
| Notice                    | Los estados tienen etiqueta textual; error anuncia mediante alert. Evitar usar role=status para mensajes que cambian continuamente.                                                                                                                             |
| Divider                   | Separador horizontal/vertical con orientación vertical explícita; variante space es decorativa y se oculta a AT.                                                                                                                                                |
| ProjectCard / SocialLinks | Enlaces tienen texto visible; los enlaces externos declaran rel noreferrer/external. Verificar destinos y texto alternativo de imágenes en cada uso.                                                                                                            |
| SectionHeading / Timeline | Usan encabezados nativos; nivel del SectionHeading y h3 de Timeline deben encajar en el outline de la página.                                                                                                                                                   |
| Card                      | El título se renderiza en un `<header>`, no en un encabezado h1–h6. No confiar en Card para crear jerarquía semántica; incluir encabezados adecuados en children si el contenido lo requiere.                                                                   |
| Timeline                  | `role="list"` explícito conserva la semántica de lista en Safari, que la elimina junto a `list-style: none`.                                                                                                                                                    |
| Badge                     | El punto inicial es un `<span aria-hidden>`; el nombre accesible del badge es solo el texto de children.                                                                                                                                                        |
| Todos                     | Probar textos largos y acentuados, zoom 200%, navegación teclado/foco, contraste en ambos temas y reduced motion. La documentación no sustituye las pruebas visuales/manuales.                                                                                  |

## Ejemplo

```svelte
<script>
	import { Button, Notice, TextField } from '@benitoanagua/folio';
	let email = $state('');
</script>

<TextField
	id="contact-email"
	label="Correo electrónico"
	bind:value={email}
	hint="Usaremos este correo para responder."
/>
<Notice tone="note" label="Privacidad">El envío requiere una acción explícita.</Notice>
<Button variant="outline" onclick={() => console.log('acción')}>Continuar</Button>
```

La documentación de API no garantiza que una versión esté publicada en npm. Ver `README.md` para el proceso manual de empaquetado y publicación.
