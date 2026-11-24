# Constitución de lectura

**Preámbulo.** Toda interfaz existe para ser leída antes que para ser vista, tocada o admirada. Este sistema subordina cada decisión visual, de interacción y de componente a un único principio: que leer sea fácil, cómodo y posible para cualquier persona.

## Título I. Supremacía

- **Art. 1. Supremacía de la lectura.** Ningún componente, patrón, tema o excepción puede contradecir este título. Lo que no se lea cómodamente no está permitido, aunque sea bello o consistente.
- **Art. 2. Jerarquía de normas.** Ante un conflicto prevalece, en orden: 1) legibilidad, 2) accesibilidad, 3) comprensión, 4) función, 5) coherencia, 6) estética y marca. Una norma inferior nunca deroga una superior.
- **Art. 3. Presunción a favor del texto.** Ante la duda entre ícono y palabra, animación y quietud, decoración y espacio en blanco, se elige lo que protege el texto.

## Título II. Leyes del texto

- **Art. 4. Del cuerpo.** El texto corrido nunca baja de 1rem ni se fija en `px`. Todo texto del sistema, incluidas etiquetas y metadatos, respeta ese mínimo. Los tamaños se expresan en `rem`.
- **Art. 5. De la medida.** Ninguna línea de texto corrido supera 75 caracteres ni baja de 40. Valor por defecto: `65ch`.
- **Art. 6. Del interlineado.** Texto corrido entre 1.5 y 1.75; títulos entre 1.0 y 1.3. Ningún componente reduce el interlineado para «hacer caber» contenido.
- **Art. 7. Del contraste.** Texto corrido, 7:1 (AAA). Texto secundario y de interfaz, 4.5:1 como mínimo. Bordes de controles, 3:1. El color nunca es el único portador de significado.
- **Art. 8. De la jerarquía.** Se construye con tamaño, peso y espacio, en ese orden. Color y decoración son refuerzos, no estructura. Un mismo nivel se ve igual en todo el sistema.
- **Art. 9. De las fuentes.** Cada tema declara una fuente de títulos, una de texto y una de interfaz. Las decorativas o de un solo peso no se usan en texto de interfaz ni en cuerpo.
- **Art. 10. De la lengua.** Todo texto declara su `lang`. El sistema soporta `latin-ext` completo (ñ, tildes, ¿ ¡, comillas del idioma).

## Título III. Leyes de la interfaz

- **Art. 11. El componente sirve al texto.** Todo componente se diseña desde su contenido textual hacia afuera. Ningún contenedor comprime, trunca u oculta el texto.
- **Art. 12. Prohibición de truncar.** El texto esencial no se corta con puntos suspensivos. Si no cabe, el contenedor crece o el texto se reparte en líneas. Solo el texto auxiliar puede truncarse, con acceso al íntegro.
- **Art. 13. Las etiquetas son palabras.** Todo control tiene etiqueta textual visible. Los íconos solos se admiten únicamente si su significado es universal, y llevan nombre accesible.
- **Art. 14. De botones y enlaces.** Su texto describe la acción o el destino. Los enlaces dentro de prosa se distinguen por subrayado, no solo por color.
- **Art. 15. De los formularios.** Cada campo tiene etiqueta visible persistente, ayuda en texto y errores explicados con palabras junto al campo, en lenguaje llano.
- **Art. 16. De la densidad.** La densidad nunca reduce el texto por debajo del Art. 4. Un modo compacto recorta espacio decorativo, jamás tamaño de letra ni interlineado.
- **Art. 17. Del espacio.** El espacio en blanco es parte de la tipografía: separa ideas, marca jerarquía y descansa la vista. El ritmo vertical se construye con múltiplos de un módulo.
- **Art. 18. Del movimiento.** Ninguna animación compite con la lectura ni mueve texto mientras se lee. Todo movimiento respeta `prefers-reduced-motion` y es prescindible.
- **Art. 19. Del fondo.** Ninguna imagen, degradado o patrón se coloca bajo texto sin garantizar el contraste del Art. 7 en el peor punto.
- **Art. 20. De los temas.** Modo claro, oscuro y de alto contraste cumplen los mismos artículos. Cambiar de tema nunca altera medida, escala ni jerarquía; solo color.

## Título IV. Control del lector

- **Art. 21. Soberanía del lector.** El usuario puede ampliar el texto al 200% o más sin pérdida de contenido ni desplazamiento horizontal. Ninguna interfaz bloquea el zoom ni ignora las preferencias del sistema.
- **Art. 22. Foco legible.** El foco de teclado es siempre visible y nunca tapa el texto que señala. El orden de tabulación sigue el orden de lectura.
- **Art. 23. Lectura lineal.** El orden del DOM coincide con el orden visual. Ningún contenido esencial depende de hover, gestos o posición.
- **Art. 24. Estados con palabras.** Carga, vacío, error y éxito se comunican con texto claro, no solo con íconos, colores o animaciones.

## Título V. Excepciones

- **Art. 25. Excepciones.** Solo son válidas si: 1) están justificadas por escrito (ADR) con el artículo exceptuado; 2) son locales a un componente concreto; 3) no degradan los artículos inderogables.
- **Art. 26. Artículos inderogables.** 1, 2, 4, 5, 6, 7, 21 y 22.
- **Art. 27. Resolución de conflictos.** Se aplica el Art. 2. Si persiste la duda, se prueba con lectores reales o con la lista del Título VI y se elige lo que mejor proteja la lectura.

## Título VI. Verificación y reforma

- **Art. 28. Lista obligatoria.** Ningún componente se aprueba sin pasar: texto ≥ 1rem en unidades relativas; medida 40–75 caracteres; interlineado en rango; contraste verificado en ambos temas; legible al 200% de zoom; sin truncar texto esencial; etiquetas visibles y nombres accesibles; foco visible y orden lógico; funciona con `prefers-reduced-motion`; probado con texto largo y con español acentuado.
- **Art. 29. Verificación automatizada.** Los artículos medibles (4, 5, 6, 7) se comprueban con `pnpm run check:design`. Una violación bloquea la compilación.
- **Art. 30. Reforma.** Esta Constitución solo se modifica mediante un ADR que demuestre, con evidencia de lectura, que el cambio mejora o mantiene la legibilidad. Ninguna reforma puede alterar el Art. 1 ni el orden del Art. 2.
