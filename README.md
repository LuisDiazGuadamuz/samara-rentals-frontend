# Samara Rentals - SPA inmobiliaria (React + Vite)

Aplicación web para listar y administrar propiedades en Sámara, Carrillo y Nosara (Costa Rica). Frontend SPA/PWA que consume una API GraphQL, maneja autenticación JWT, favoritos, administración básica y soporte offline.

## Resumen rápido

Frontend moderno con React, Vite y TailwindCSS. Consume datos desde un backend GraphQL a través de Apollo Client; implementa autenticación JWT, rutas protegidas por rol y una página de favoritos diseñada como catálogo.

## Estado y puntos importantes

- Integración principal: React + Vite + TailwindCSS con `@apollo/client` para GraphQL.
- Autenticación: JWT guardado en `localStorage`, `AuthContext` gestiona sesión y roles (`isAuthenticated`, `isAdmin`, `isAgent`).
- PWA: existe `public/manifest.json` y se registra `public/sw.js` en producción desde `src/main.jsx`. `public/offline.html` sirve como fallback offline.
- Offline: la app guarda `cached_properties` en `localStorage` y usa `public/properties.json` como último recurso.

## Scripts (extraídos de `package.json`)

- `npm run dev` — inicia Vite en modo desarrollo.
- `npm run build` — crea build de producción con Vite.
- `npm run preview` — sirve el build localmente para pruebas.
- `npm run lint` — ejecuta ESLint en el proyecto.
- `npm run predeploy` — corre `build` antes de `deploy`.
- `npm run deploy` — despliega `dist` a GitHub Pages (`gh-pages -d dist`).

## Dependencias clave

- `react`, `react-dom`
- `@apollo/client`, `graphql`
- `react-router-dom`, `react-icons`
- `tailwindcss`, `postcss`, `autoprefixer`
- `vite`, `@vitejs/plugin-react`

## Cómo ejecutar (rápido)

1. Instala dependencias:
```bash
npm install
```
2. Configura variable de entorno (opcional):
```bash
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```
3. Levanta el frontend en desarrollo:
```bash
npm run dev
```
4. Producción (build + preview):
```bash
npm run build
npm run preview
```
5. Despliegue a GitHub Pages (requiere `gh-pages` y repo configurado):
```bash
npm run predeploy
npm run deploy
```

## Estructura y archivos clave

- `src/main.jsx` — inicialización de React, registro de service worker y providers.
- `src/App.jsx` — envoltorio global y proveedor de propiedades.
- `src/router/AppRouter.jsx` — definición de rutas públicas y privadas.
- `src/context/AuthContext.jsx` — control de sesión y roles.
- `src/graphql/client.js` — configuración de Apollo Client (headers de auth y cache).
- `src/graphql/queries.js`, `src/graphql/mutations.js` — operaciones GraphQL.
- `src/services/*` — lógica para `property`, `favorite`, `auth`, `upload`, `inquiry`.
- `public/manifest.json` — manifiesto PWA (ya incluido).
- `public/sw.js` — service worker y `public/offline.html` — fallback offline.

## Variables de entorno

- `VITE_GRAPHQL_URL` — URL de la API GraphQL (por defecto `http://localhost:4000/graphql`).

## Notas, limitaciones y recomendaciones

- La PWA tiene `manifest.json` y service worker, revisar icons en `public/icons`.
- No hay tests automatizados configurados; se recomienda añadir `vitest` o React Testing Library.
- Añadir validación de formularios en `LoginPage` y `RegisterPage` y mejorar feedback UX en el admin.
- Revisar el despliegue a `gh-pages` (ajustar `homepage` en `package.json` si es necesario).

## Verificación rápida

- Abrir `/login`, `/register`, `/properties`, `/properties/:id`, `/favorites`, `/profile` y `/admin` según permisos.
- Probar modo offline: detener backend y comprobar fallback desde `localStorage` o `public/properties.json`.

---

Si quieres, puedo:

- agregar una sección de Contribución y comandos comunes (`git`, ramas, PR),
- crear ejemplos de `.env` y un archivo `setup.md`,
- o añadir badges para build / deploy / lint en la parte superior del README.
