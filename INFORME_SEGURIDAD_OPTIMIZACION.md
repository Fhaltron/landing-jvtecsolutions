# Informe de seguridad y optimización

Fecha de revisión: 15 de julio de 2026

## Resumen ejecutivo

Se auditó la versión actual de la landing page construida con React 19, Vite 8 y OGL. El alcance incluyó código fuente, dependencias npm, configuración de compilación, enlaces externos, acceso al DOM, almacenamiento local, recursos estáticos, animación WebGL y configuración de despliegue en Vercel.

No se encontraron vulnerabilidades críticas, altas, moderadas o bajas conocidas en las dependencias instaladas. Tampoco se encontraron mecanismos de inyección como `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` o `document.write`, ni credenciales dentro del código revisado.

Se aplicaron medidas de defensa en profundidad, correcciones de robustez y optimizaciones de GPU/CPU. Las cabeceras HTTP nuevas entrarán en vigor cuando `vercel.json` se despliegue en Vercel.

## Resultado por nivel de riesgo

| Nivel | Abiertos | Corregidos |
| --- | ---: | ---: |
| Crítico | 0 | 0 |
| Alto | 0 | 0 |
| Medio | 0 | 2 |
| Bajo | 2 | 5 |

Los dos pendientes bajos se describen al final del informe y no representan una puerta de acceso al sitio.

## Hallazgos de seguridad corregidos

### 1. Ausencia de cabeceras HTTP defensivas

- **Nivel original:** medio, como defensa en profundidad.
- **Riesgo:** el despliegue no definía restricciones explícitas frente a carga de recursos no autorizados, inclusión del sitio en marcos, detección incorrecta de tipos MIME o acceso a funciones sensibles del navegador.
- **Corrección:** se añadió `vercel.json` con las siguientes cabeceras:
  - `Content-Security-Policy` estricta, sin `unsafe-inline` ni `unsafe-eval`.
  - `Cross-Origin-Opener-Policy: same-origin`.
  - `Permissions-Policy` para desactivar cámara, ubicación, micrófono, pagos y USB.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Strict-Transport-Security` por un año e inclusión de subdominios.
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: DENY`.
  - `X-XSS-Protection: 0`, valor recomendado para desactivar filtros heredados defectuosos.

La CSP limita scripts, estilos, imágenes, fuentes y conexiones al mismo origen; bloquea objetos, formularios y marcos; restringe la URL base y actualiza solicitudes inseguras a HTTPS.

### 2. Riesgo de consumo excesivo de GPU y memoria en Lightfall

- **Nivel original:** medio para disponibilidad y experiencia del cliente.
- **Riesgo:** usar sin límite el `devicePixelRatio` podía multiplicar el número de píxeles renderizados en pantallas de alta densidad. Además, la animación seguía activa aunque estuviera fuera de pantalla o la pestaña estuviera oculta.
- **Corrección:**
  - DPR limitado a un máximo de `2`.
  - Antialias desactivado para el shader de pantalla completa.
  - Animación pausada mediante `IntersectionObserver` cuando sale del viewport.
  - Animación pausada cuando el documento queda oculto.
  - Respeto real de `prefers-reduced-motion`.
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

## Optimizaciones aplicadas

### Rendimiento

- La portada declara dimensiones, `fetchPriority="high"` y decodificación asíncrona.
- Las imágenes no prioritarias usan `loading="lazy"` y `decoding="async"`.
- El canvas decorativo está oculto para tecnologías de asistencia.
- Los cambios de contraste del menú se agrupan con `requestAnimationFrame`.
- El estado del menú solo se modifica cuando cambia realmente el contraste necesario.
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
- Oxlint 1.71.0

Resultados del 15 de julio de 2026:

- `npm audit --omit=dev`: **0 vulnerabilidades**.
- `npm audit`: **0 vulnerabilidades** incluyendo herramientas de desarrollo.

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
- Búsqueda de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`, scripts inline y enlaces externos sin aislamiento.
- Revisión de montaje y limpieza de eventos, observadores, WebGL y cuadros de animación.
- Validación visual local de la portada y navegación.
- Revisión de recursos generados por Vite y rutas de imágenes.
- Validación de la configuración JSON de Vercel y de espacios/conflictos en los cambios.
- Sintaxis de `headers` cotejada con la [documentación oficial de `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json).

## Recomendaciones operativas

1. Ejecutar `npm run check` antes de cada publicación.
2. Ejecutar `npm audit` periódicamente y antes de actualizar producción.
3. Revisar en Vercel que las cabeceras de `vercel.json` aparezcan en la respuesta del dominio público.
4. No guardar tokens, contraseñas ni archivos `.env` reales en Git.
5. Mantener activa la autenticación multifactor en GitHub y Vercel.
6. Proteger la rama `main` con Pull Requests si más personas empiezan a colaborar.
