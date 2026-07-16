# JV TecSolutions

Landing page de JV TecSolutions construida con React y Vite. Incluye tema claro/oscuro, navegación flotante con contraste dinámico y una portada WebGL con el efecto Lightfall.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Desarrollo local

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la URL local, normalmente `http://localhost:5173`.

## Validación

```bash
npm run check
```

Este comando ejecuta el linter y genera la compilación de producción. También pueden ejecutarse por separado:

```bash
npm run lint
npm run build
```

## Estructura relevante

- `src/App.jsx`: contenido, tema y comportamiento de navegación.
- `src/App.css` y `styles.css`: estilos específicos y generales.
- `src/Lightfall.jsx`: renderizado y ciclo de vida de la animación WebGL.
- `assets/`: logo y portada importados por Vite.
- `vercel.json`: cabeceras HTTP de seguridad para producción.
- `INFORME_SEGURIDAD_OPTIMIZACION.md`: auditoría y decisiones de seguridad.

## Despliegue

Vercel ejecuta `npm run build` y publica `dist/`. Los cambios enviados a la rama de producción configurada en Vercel generan un nuevo despliegue automáticamente.

Antes de publicar:

```bash
npm run check
git status
```

No deben versionarse `node_modules/`, `dist/`, archivos `.local` ni credenciales.
