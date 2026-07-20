# Registro de cambios de JV TecSolutions

Este documento registra los cambios realizados en la landing page. Las entradas se organizan de la más reciente a la más antigua e indican la fecha, el tipo de cambio y los archivos afectados.

## 20 de julio de 2026

### Galería y visor de imágenes

- Se centró automáticamente la miniatura cuando la galería contiene una sola imagen.
- La cuadrícula quedó preparada para distribuir y centrar futuras imágenes en varias filas.
- Se integró la imagen real desde `assets/servicios-computo.jpeg` mediante el sistema de recursos de Vite.
- Se actualizaron la miniatura y el visor para utilizar correctamente el formato `.jpeg`.
- Se preparó una miniatura interactiva para el anuncio de reparación de equipo de cómputo.
- La miniatura utiliza la misma elevación, escala y brillo de las tarjetas al pasar el cursor.
- Al seleccionar la miniatura se abre un visor de pantalla completa sin perder la posición de la página.
- El visor puede cerrarse con el botón, haciendo clic fuera de la imagen o presionando `Escape`.
- Al cerrar el visor se restaura el foco en la miniatura y se reactiva el desplazamiento de la página.
- Se agregaron etiquetas accesibles, foco visible y compatibilidad con movimiento reducido.
- La imagen se almacena como `assets/servicios-computo.jpeg` y Vite genera automáticamente su ruta optimizada de producción.

Archivos afectados:

- `src/App.jsx`
- `src/App.css`
- `assets/servicios-computo.jpeg`

## 19 de julio de 2026

### Ajustes del modo claro

- Se igualó el fondo de la tarjeta de “Sobre nosotros” al blanco perla general de la página.
- La tarjeta ahora se distingue mediante una línea morada tenue y una sombra más discreta, sin usar blanco brillante.
- Se igualó el fondo de “Cotiza con JV TecSolutions” al blanco perla general, conservando únicamente sus líneas divisorias.
- Se sustituyó el blanco brillante del modo claro por una paleta blanco perla más suave para reducir la fatiga visual.
- La tarjeta de información de “Sobre nosotros” cambió de negro a blanco perla en modo claro.
- Se adaptaron textos, separadores, borde y títulos de la tarjeta para mantener un contraste accesible.
- La sección “Cotiza con JV TecSolutions” cambió de degradado morado a blanco perla en modo claro.
- El modo oscuro conserva el fondo negro de la tarjeta y el degradado morado del bloque de contacto.
- Se actualizó el tono de navegación del bloque de contacto para que el menú flotante cambie correctamente de contraste en ambos temas.

Archivos afectados:

- `styles.css`
- `src/App.jsx`

## 18 de julio de 2026

### Navegación, contenido y redes sociales

- Se optimizó Lightfall limitando el render a 30 FPS en escritorio y 24 FPS en móvil.
- Se redujo el DPR máximo del canvas a 1.5 en escritorio y 1 en dispositivos táctiles.
- Se redujeron de 39 a 28 las iteraciones principales del shader para disminuir carga de GPU.
- Lightfall ahora se mantiene estático con ahorro de datos, movimiento reducido, pestaña oculta o fuera del viewport.
- Se desactivó la interacción de cursor del shader en dispositivos táctiles.
- El cálculo de contraste del menú se limitó a una ejecución cada 80 ms durante el scroll.
- Se redujeron los desenfoques de la navegación y portada; en tablet y móvil se eliminó el desenfoque del menú para mejorar la fluidez.
- Se reforzó la CSP para marcos, multimedia, manifiestos, workers y recursos secundarios.
- Se agregaron `Cross-Origin-Resource-Policy` y nuevas restricciones en `Permissions-Policy`.
- Se agregó una política de referencia directamente en `index.html` como respaldo.
- Se ejecutó una auditoría npm de producción con resultado de 0 vulnerabilidades.
- Se actualizó `INFORME_SEGURIDAD_OPTIMIZACION.md` con la auditoría y las optimizaciones del 18 de julio.
- Se agregó un efecto de magnificación tipo Dock al pasar el cursor sobre tarjetas, ventanas y botones.
- Las tarjetas ahora se elevan, aumentan ligeramente de tamaño y muestran una sombra con brillo morado.
- Los iconos de servicios y datos destacados reciben una magnificación adicional al interactuar con su tarjeta.
- El efecto se limita a dispositivos con cursor preciso y se desactiva cuando el usuario prefiere movimiento reducido.
- Se corrigió el enlace de Instagram a `https://www.instagram.com/jv_tecsolutions/`.
- Se colocaron los iconos de redes sociales y correo arriba de la leyenda legal del pie de página.
- Se corrigió la leyenda a “JV TecSolutions - Soluciones en Tecnología”.
- Se redujo el logo del pie de página para darle una apariencia más discreta.
- Se convirtió el logo del menú flotante en un enlace para volver al inicio de la página.
- Se agregó el identificador `inicio` al encabezado principal como destino del enlace del logo.
- Se centró vertical y horizontalmente el texto de “Sobre nosotros” respecto a la tarjeta de información lateral.
- Se movió “Todos los derechos reservados” al primer renglón del pie de página.
- Se eliminó del pie el renglón textual que mostraba WhatsApp y correo.
- Se agregaron iconos con hipervínculos para Facebook, WhatsApp, Instagram y correo electrónico.
- Se añadieron nombres accesibles, protección para enlaces externos y estilos de foco y hover a los iconos sociales.
- Se verificó el proyecto mediante lint y compilación de producción sin errores.
- Se inició una vista previa local con Vite en `http://127.0.0.1:5173/`.

Archivos afectados:

- `index.html`
- `src/App.jsx`
- `src/App.css`
- `src/Lightfall.jsx`
- `vercel.json`
- `INFORME_SEGURIDAD_OPTIMIZACION.md`

## 12 de julio de 2026

### Revisión de seguridad y optimización

- Se revisó el HTML, CSS y JavaScript en busca de riesgos de seguridad y problemas de rendimiento.
- Se protegieron los enlaces externos contra `reverse tabnabbing`.
- Se agregó una política de seguridad de contenido y una política de referencia.
- Se trasladó el JavaScript incrustado a un archivo independiente.
- Se centralizó el manejo del tema y de imágenes no disponibles.
- Se agregaron carga diferida, decodificación asíncrona y dimensiones a las imágenes.
- Se añadió compatibilidad con `prefers-reduced-motion`.
- Se creó `INFORME_SEGURIDAD_OPTIMIZACION.md` con los hallazgos y recomendaciones.
- Se corrigió la portada para conservar su proporción, mostrarse completa y responder al tamaño de pantalla.

Archivos afectados en la versión estática utilizada en ese momento:

- `index.html`
- `styles.css`
- `script.js`
- `INFORME_SEGURIDAD_OPTIMIZACION.md`

## 11 de julio de 2026

### Diseño y estructura visual

- Se unificaron en blanco los fondos del modo claro y se conservaron los contrastes del modo oscuro.
- Se mantuvo el degradado de la barra de navegación.
- Se centró el contenido general y se estableció un ancho máximo responsive.
- Se reorganizó el menú para tablet y móvil.
- Se eliminaron alturas forzadas que producían espacios vacíos en la portada.
- Se reemplazaron emojis de servicios por iconos vectoriales para Wi-Fi, memoria RAM, laptop, cámara CCTV y Smart Home.
- Se corrigió el color del nombre “JV TecSolutions” en la barra de navegación.
- Se actualizó el correo de contacto a `jvtecsolutions@gmail.com`.
- Se agregó “Todos los derechos reservados” al pie de página.
- Se agregó el logotipo como favicon.
- Se convirtió “Cotiza con JV TecSolutions” en una sección de ancho completo.
- Se mejoró la jerarquía visual de los encabezados de sección.
- Se ajustó la galería para no reservar espacio cuando sus imágenes no están disponibles.

Archivos afectados en la versión estática utilizada en ese momento:

- `index.html`
- `styles.css`

## Criterio para futuras entradas

Cada cambio nuevo debe registrar:

- La fecha en que se realizó.
- El componente o sección modificada.
- Lo agregado, actualizado, corregido o eliminado.
- Los archivos afectados.
- Las validaciones ejecutadas, cuando correspondan.
