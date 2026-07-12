# Informe de seguridad y optimización

Fecha de revisión: 12 de julio de 2026

## Resumen

Se revisaron `index.html`, `styles.css`, los recursos disponibles en `assets/` y el JavaScript de la página. No se encontraron vulnerabilidades críticas ni manejo de datos sensibles. Se corrigieron riesgos de seguridad propios de enlaces externos y se reforzó el sitio con una política de seguridad de contenido.

## Hallazgos de seguridad corregidos

### 1. Enlaces externos vulnerables a `reverse tabnabbing`

- **Nivel:** medio-bajo.
- **Ubicación:** enlaces de WhatsApp y Facebook que usaban `target="_blank"`.
- **Riesgo:** una página externa abierta en otra pestaña podría intentar acceder a la pestaña de origen mediante `window.opener` en navegadores o contextos que no apliquen aislamiento automático.
- **Corrección:** se agregó `rel="noopener noreferrer"` a todos los enlaces que abren una pestaña nueva.

### 2. Ausencia de una política de seguridad de contenido

- **Nivel:** medio como medida de defensa en profundidad.
- **Riesgo:** si en el futuro se introdujera contenido no confiable, el navegador no tenía restricciones explícitas para scripts, estilos, marcos u objetos.
- **Corrección:** se agregó una política CSP que limita los recursos al mismo origen, bloquea objetos y marcos, impide cambios de URL base y actualiza solicitudes inseguras a HTTPS.
- **Política aplicada:** `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests`.

### 3. JavaScript y manejadores de eventos incrustados en HTML

- **Nivel:** bajo; no era una vulnerabilidad explotable por sí sola, pero impedía utilizar una CSP estricta sin permitir código inline.
- **Ubicación:** los bloques `<script>` y los atributos `onerror` de la galería.
- **Corrección:** todo el comportamiento se movió a `script.js`, y los errores de imágenes se controlan con `addEventListener`.

### 4. Política de referencia no definida

- **Nivel:** bajo, relacionado con privacidad.
- **Riesgo:** el navegador podía compartir más información de navegación de la necesaria al visitar sitios externos, dependiendo de su configuración predeterminada.
- **Corrección:** se agregó `strict-origin-when-cross-origin`.

## Optimizaciones aplicadas

### Rendimiento

- El JavaScript se carga desde un archivo externo con `defer`, evitando bloquear el análisis del documento.
- Las imágenes de galería y el logo del pie usan carga diferida con `loading="lazy"`.
- Se agregó `decoding="async"` a imágenes que no necesitan decodificación síncrona.
- La imagen principal usa `fetchpriority="high"` para indicar que es un recurso visual prioritario.
- Se declararon dimensiones en las imágenes disponibles para reducir cambios inesperados de diseño durante la carga.

### Mantenibilidad y robustez

- La lógica del tema y de imágenes no disponibles se centralizó en `script.js`.
- El código comprueba que los elementos existan antes de registrar eventos, evitando errores si cambia el HTML.
- El acceso a `localStorage` permanece protegido para que la página funcione cuando el navegador lo bloquee.
- Se eliminó JavaScript inline, facilitando auditorías y futuras ampliaciones de la CSP.

### Accesibilidad

- Se agregó soporte para `prefers-reduced-motion`, desactivando desplazamientos suaves y animaciones para usuarios que soliciten menos movimiento.
- El emoji decorativo de “Páginas web” se marcó como oculto para lectores de pantalla, ya que el encabezado de la tarjeta ya comunica su significado.

## Problemas funcionales detectados

Las siguientes imágenes están referenciadas en la galería, pero no existen actualmente dentro de `assets/`:

- `servicios-computo.jpg`
- `servicios-web.jpg`
- `servicios-camaras.jpg`
- `servicios-redes.jpg`

La página las oculta al detectar el error para evitar espacios vacíos o iconos rotos. Para mostrar la galería, deben agregarse archivos con esos nombres o actualizar las rutas en `index.html`.

## Recomendaciones para el servidor de producción

Una página HTML no puede imponer por sí sola todos los encabezados de seguridad. Al publicar el sitio se recomienda configurar en el servidor:

- `Content-Security-Policy` como encabezado HTTP, sustituyendo o reforzando la etiqueta meta actual.
- `Strict-Transport-Security` cuando el dominio funcione completamente con HTTPS.
- `X-Content-Type-Options: nosniff`.
- `Permissions-Policy` para desactivar funciones del navegador que el sitio no utiliza.
- Protección contra inclusión en marcos mediante `frame-ancestors 'none'` dentro de la CSP enviada por HTTP.

También conviene generar un favicon pequeño y comprimir `assets/logo.png`, que actualmente pesa aproximadamente 352 KB y resulta más grande de lo necesario para una pestaña del navegador.

## Validaciones realizadas

- Sintaxis de `script.js` comprobada con `node --check`.
- Revisión de espacios y errores de parche con `git diff --check`.
- Búsqueda de JavaScript inline, atributos `onerror`, enlaces sin aislamiento, URLs HTTP, `eval`, `innerHTML` y `document.write`.
- Verificación de existencia de los recursos referenciados por la galería.
