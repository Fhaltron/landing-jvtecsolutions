# Informe de seguridad y optimización

Última revisión: 20 de julio de 2026

## Resumen ejecutivo

Se auditó la versión actual de la landing page construida con React 19, Vite 8 y OGL. El alcance incluyó código fuente, dependencias npm, configuración de compilación, enlaces externos, acceso al DOM, almacenamiento local, recursos estáticos, animación WebGL y configuración de despliegue en Vercel.

No se encontraron vulnerabilidades críticas, altas, moderadas o bajas conocidas en las dependencias instaladas. Tampoco se encontraron mecanismos de inyección como `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` o `document.write`, ni credenciales dentro del código revisado.

Se aplicaron medidas de defensa en profundidad, correcciones de robustez y optimizaciones de GPU/CPU. Las cabeceras HTTP nuevas entrarán en vigor cuando `vercel.json` se despliegue en Vercel.

## Auditoría incremental del 20 de julio de 2026

Se repitió la auditoría después de integrar el visor de galería y los últimos cambios visuales. La interfaz, las animaciones y la configuración de rendimiento no fueron modificadas durante esta revisión.

Resultados:

- `npm run check`: lint y compilación de producción completados sin errores ni advertencias.
- `npm audit --audit-level=low`: **0 vulnerabilidades** en dependencias de producción y desarrollo.
- Árbol completo revisado mediante `npm ls --all`; las dependencias opcionales ausentes corresponden a otras plataformas o herramientas no utilizadas.
- Sin `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `new Function`, `document.write`, ejecución de procesos, sockets WebSocket propios, service workers ni solicitudes de red iniciadas por la aplicación.
- Sin secretos, contraseñas, tokens, claves API, certificados o archivos `.env` dentro del proyecto revisado.
- Sin enlaces simbólicos inesperados.
- Todos los enlaces con `target="_blank"` mantienen `rel="noopener noreferrer"`.
- Los archivos JSON de npm y Vercel se analizaron correctamente.
- El bundle no contiene mapas de código fuente ni URLs de servidores desconocidos; las URLs de documentación de React dentro del runtime son parte oficial de React.

### Revisión de scripts de instalación

El único paquete del lockfile marcado con script de instalación es `fsevents`, dependencia opcional exclusiva de macOS. No se instala ni ejecuta en el entorno Linux actual. Los scripts propios del proyecto se limitan a Vite, Oxlint, compilación, vista previa y auditoría npm; no ejecutan comandos de sistema ocultos.

### Puertos y procesos locales

- La vista previa de esta landing escucha en `127.0.0.1:5173`; está limitada a la interfaz local y no queda expuesta a la red.
- Se observaron otros servicios del equipo en `0.0.0.0:22`, `0.0.0.0:4000`, `0.0.0.0:7070` y `*:5201`. No forman parte del código ni de los procesos de esta landing y no se modificaron.
- Los puertos `22`, `4000`, `5201` y `7070` deben revisarse a nivel de sistema operativo y firewall si no son servicios intencionales. Esta observación no constituye una vulnerabilidad del sitio web.

### Procedencia de paquetes npm

`npm audit signatures` no pudo completar toda la validación porque `picocolors@1.1.1` conserva una firma del registro asociada a una clave pública expirada el 29 de enero de 2025 (`EEXPIREDSIGNATUREKEY`). Esto no equivale a una vulnerabilidad ni a evidencia de manipulación: la integridad SHA-512 del lockfile está presente y `npm audit` reporta 0 vulnerabilidades. Se conserva como limitación verificable de la auditoría de procedencia.

## Resultado por nivel de riesgo

| Nivel | Abiertos | Corregidos |
| --- | ---: | ---: |
| Crítico | 0 | 0 |
| Alto | 0 | 0 |
| Medio | 0 | 3 |
| Bajo | 2 | 6 |

Los dos pendientes bajos se describen al final del informe y no representan una puerta de acceso al sitio.

## Hallazgos de seguridad corregidos

### 1. Ausencia de cabeceras HTTP defensivas

- **Nivel original:** medio, como defensa en profundidad.
- **Riesgo:** el despliegue no definía restricciones explícitas frente a carga de recursos no autorizados, inclusión del sitio en marcos, detección incorrecta de tipos MIME o acceso a funciones sensibles del navegador.
- **Corrección:** se añadió `vercel.json` con las siguientes cabeceras:
  - `Content-Security-Policy` estricta, sin `unsafe-inline` ni `unsafe-eval`.
  - `Cross-Origin-Opener-Policy: same-origin`.
  - `Cross-Origin-Embedder-Policy: require-corp`.
  - `Cross-Origin-Resource-Policy: same-origin`.
  - `Origin-Agent-Cluster: ?1`.
  - `Permissions-Policy` para desactivar cámara, ubicación, micrófono, pagos y USB.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Strict-Transport-Security` por un año e inclusión de subdominios.
  - `X-Content-Type-Options: nosniff`.
  - `X-DNS-Prefetch-Control: off`.
  - `X-Frame-Options: DENY`.
  - `X-Permitted-Cross-Domain-Policies: none`.
  - `X-XSS-Protection: 0`, valor recomendado para desactivar filtros heredados defectuosos.

La CSP limita scripts, estilos, imágenes, fuentes y conexiones al mismo origen; bloquea objetos, formularios y marcos; restringe la URL base y actualiza solicitudes inseguras a HTTPS.

### 2. Riesgo de consumo excesivo de GPU y memoria en Lightfall

- **Nivel original:** medio para disponibilidad y experiencia del cliente.
- **Riesgo:** usar sin límite el `devicePixelRatio` podía multiplicar el número de píxeles renderizados en pantallas de alta densidad. Además, la animación seguía activa aunque estuviera fuera de pantalla o la pestaña estuviera oculta.
- **Corrección:**
  - DPR limitado a `1.5` en escritorio y `1` en dispositivos con puntero táctil.
  - Frecuencia limitada a un máximo de 30 FPS en escritorio y 24 FPS en móvil.
  - Iteraciones principales del shader reducidas de 39 a 28, conservando el aspecto visual.
  - Antialias desactivado para el shader de pantalla completa.
  - Animación pausada mediante `IntersectionObserver` cuando sale del viewport.
  - Animación pausada cuando el documento queda oculto.
  - Respeto real de `prefers-reduced-motion`.
  - Animación estática cuando el navegador indica ahorro de datos mediante `saveData`.
  - Interacción con el cursor desactivada automáticamente en dispositivos táctiles.
  - Render estático inicial cuando la animación no debe continuar.
  - Detención controlada si WebGL falla durante el renderizado.

### 3. Reinicialización innecesaria del contexto WebGL

- **Nivel original:** bajo.
- **Riesgo:** el arreglo de colores se construía dentro del render de `App`, por lo que cambiaba de identidad y podía disparar nuevamente el efecto de Lightfall al actualizar el estado de React.
- **Corrección:** la paleta se convirtió en una constante estable e inmutable fuera del componente. También se eliminaron propiedades de color redundantes que Lightfall no utilizaba.

### 4. Valores de color y DPR sin validación defensiva

- **Nivel original:** bajo.
- **Riesgo:** valores inválidos podían producir `NaN`, errores del shader o tamaños de render no razonables si el componente se reutilizaba con datos externos en el futuro.
- **Corrección:** se validan colores hexadecimales, se usa un color seguro como respaldo y se normaliza el DPR a un rango permitido.

### 5. Manipulación del DOM menos mantenible en la navegación

- **Nivel original:** bajo.
- **Riesgo:** buscar la barra repetidamente con `document.querySelector` acoplaba el comportamiento a una consulta global y podía seleccionar un elemento inesperado tras futuras modificaciones.
- **Corrección:** la navegación ahora usa una referencia de React (`useRef`) y mantiene la actualización de contraste dentro de `requestAnimationFrame`.

### 6. Recursos de galería inexistentes

- **Nivel original:** bajo y funcional.
- **Riesgo:** las rutas inexistentes generan respuestas 404 e iconos de imagen rota.
- **Corrección:** las imágenes usan un manejador de error de React que las oculta de forma segura, además de carga diferida y decodificación asíncrona.
- **Pendiente de contenido:** deben agregarse los archivos descritos en “Pendientes” para que la galería sea visible.

### 7. Enlaces externos y almacenamiento local

- Los enlaces abiertos con `target="_blank"` conservan `rel="noopener noreferrer"`, evitando acceso mediante `window.opener`.
- El acceso a `localStorage` está dentro de bloques `try/catch`; si el navegador lo bloquea, solo se pierde la persistencia del tema y la página continúa funcionando.
- El valor recuperado de almacenamiento se compara únicamente contra la cadena `dark` y no se inserta como HTML.

### 8. Aislamiento de recursos y permisos del navegador

- **Nivel original:** bajo, como defensa en profundidad.
- **Riesgo:** la política anterior no declaraba explícitamente el tratamiento de recursos secundarios, multimedia, manifiestos y workers, y dejaba disponibles funciones del navegador que la landing no utiliza.
- **Corrección:**
  - Se añadió `Cross-Origin-Resource-Policy: same-origin`.
  - La CSP bloquea explícitamente `child-src`, `frame-src` y `media-src`, y restringe manifiestos y workers al mismo origen.
  - `Permissions-Policy` desactiva acelerómetro, reproducción automática, temas de publicidad, captura de pantalla, contenido cifrado, giroscopio, magnetómetro, picture-in-picture y credenciales públicas, además de las capacidades ya bloqueadas.
  - Se agregó una política de referencia también en el HTML como respaldo para despliegues que no utilicen Vercel.

## Optimizaciones aplicadas

### Rendimiento

- La portada declara dimensiones, `fetchPriority="high"` y decodificación asíncrona.
- Las imágenes no prioritarias usan `loading="lazy"` y `decoding="async"`.
- El canvas decorativo está oculto para tecnologías de asistencia.
- El cálculo de contraste del menú se limita a una ejecución cada 80 ms durante el desplazamiento, en lugar de leer el layout en cada cuadro.
- El estado del menú solo se modifica cuando cambia realmente el contraste necesario.
- El desenfoque del menú flotante se redujo de 20 px a 12 px y se sustituyó por un fondo ligeramente más opaco para conservar el diseño.
- En tablet y móvil se desactiva el `backdrop-filter` de la navegación, evitando una recomposición costosa durante el scroll.
- Los desenfoques de la tarjeta y botón secundarios de la portada se redujeron de 8 px a 4 px.
- Las animaciones hover siguen usando `transform` y se limitan a dispositivos con cursor preciso, evitando trabajo adicional en pantallas táctiles.
- El observador de tamaño ignora dimensiones iguales o menores que cero.
- Se añadió `npm run check` para ejecutar linter y compilación antes de publicar.

### Robustez y accesibilidad

- La navegación tiene un nombre accesible mediante `aria-label`.
- Se añadió un enlace para saltar directamente al contenido principal.
- El botón de tema conserva `aria-label` y `aria-pressed` dinámicos.
- Lightfall presenta un fondo de respaldo si WebGL no puede iniciarse.
- La preferencia de movimiento reducido detiene el bucle, no solo los efectos CSS.
- Los manejadores, observadores y cuadros de animación se eliminan al desmontar el componente.

### Estructura y mantenimiento

- `README.md` describe ahora el proyecto real, los comandos, la estructura y el despliegue.
- `vite.config.js` usa un formato consistente con el resto del código.
- La configuración de producción se centralizó en `vercel.json`.
- Se añadió `npm run security:audit` para repetir la revisión completa de avisos npm con nivel bajo o superior.
- La paleta y el manejador de imágenes se declararon fuera del componente para evitar recreaciones.
- El informe anterior, basado en la versión HTML/JavaScript previa, fue sustituido por esta auditoría de la aplicación React actual.

## Dependencias

Dependencias de producción revisadas:

- `react` 19.2.7
- `react-dom` 19.2.7
- `ogl` 1.0.11

Herramientas de desarrollo revisadas:

- Vite 8.1.1
- Plugin React para Vite 6.0.3
- Oxlint 1.73.0 instalado (`package.json` permite actualizaciones compatibles desde 1.71.0)

Resultados anteriores del 15 de julio de 2026:

- `npm audit --omit=dev`: **0 vulnerabilidades**.
- `npm audit`: **0 vulnerabilidades** incluyendo herramientas de desarrollo.

Comprobación repetida el 18 de julio de 2026:

- `npm audit --omit=dev --audit-level=moderate`: **0 vulnerabilidades** en dependencias de producción.

Comprobación completa del 20 de julio de 2026:

- `npm audit --audit-level=low`: **0 vulnerabilidades** en producción y desarrollo.
- `npm audit signatures`: comprobación incompleta por una clave de firma expirada del registro para `picocolors@1.1.1`; no se detectó una vulnerabilidad del paquete.

Una auditoría de dependencias solo refleja avisos conocidos en el momento de ejecutarla. Debe repetirse antes de publicaciones importantes y después de actualizar paquetes.

## Pendientes y riesgo residual

### 1. Imágenes faltantes de la galería

No existen actualmente estos recursos:

- `/assets/servicios-computo.jpg`
- `/assets/servicios-web.jpg`
- `/assets/servicios-camaras.jpg`
- `/assets/servicios-redes.jpg`

Las imágenes se ocultan de forma segura, pero las solicitudes 404 continuarán hasta agregar los archivos o retirar la galería. Es un problema funcional, no una vulnerabilidad.

### 2. Peso del logo

`assets/logo.png` mide aproximadamente 358 KB y 912×900 px, aunque se muestra principalmente entre 54 y 90 px. Conviene generar una variante optimizada de aproximadamente 256–320 px o utilizar WebP/AVIF conservando una fuente original fuera del bundle. Las herramientas de compresión de imagen no estaban disponibles en el entorno durante esta revisión.

### 3. Archivos heredados no usados por la compilación

El repositorio conserva `script.js`, copias `src/App.backup.*`, recursos de plantilla en `src/assets/` y SVG públicos que la aplicación actual no importa. No llegan al bundle principal salvo los archivos colocados en `public/`, pero aumentan ruido y pueden confundir futuras revisiones. Deben eliminarse únicamente después de confirmar que no se requieren como respaldo.

## Validaciones realizadas

- `npm run check`: linter y compilación completados correctamente.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `npm audit`: 0 vulnerabilidades.
- Nueva auditoría de producción del 18 de julio: 0 vulnerabilidades.
- Auditoría completa del 20 de julio: 0 vulnerabilidades.
- Inspección de puertos TCP y atribución del servidor Vite a `127.0.0.1:5173`.
- Revisión de scripts de instalación y de los scripts declarados en `package.json`.
- Búsqueda de credenciales, claves privadas, archivos de entorno, enlaces simbólicos y APIs de ejecución o inyección.
- Inspección del bundle final para confirmar ausencia de mapas fuente y destinos de red inesperados.
- Búsqueda de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`, scripts inline y enlaces externos sin aislamiento.
- Revisión de montaje y limpieza de eventos, observadores, WebGL y cuadros de animación.
- Validación visual local de la portada y navegación.
- Revisión de recursos generados por Vite y rutas de imágenes.
- Validación de la configuración JSON de Vercel y de espacios/conflictos en los cambios.
- Verificación de que todos los enlaces con `target="_blank"` conservan `rel="noopener noreferrer"`.
- Compilación de producción posterior a la reducción de FPS, DPR, iteraciones del shader y filtros visuales.
- Sintaxis de `headers` cotejada con la [documentación oficial de `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json).

## Recomendaciones operativas

1. Ejecutar `npm run check` antes de cada publicación.
2. Ejecutar `npm audit` periódicamente y antes de actualizar producción.
3. Revisar en Vercel que las cabeceras de `vercel.json` aparezcan en la respuesta del dominio público.
4. No guardar tokens, contraseñas ni archivos `.env` reales en Git.
5. Mantener activa la autenticación multifactor en GitHub y Vercel.
6. Proteger la rama `main` con Pull Requests si más personas empiezan a colaborar.
