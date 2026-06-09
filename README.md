# Samara Rentals - SPA Real Estate

Aplicación web inmobiliaria SPA/PWA para mostrar propiedades en Sámara, Carrillo y Nosara, Costa Rica. Esta versión adapta el proyecto para consumir datos reales desde una API GraphQL con autenticación JWT, administración, favoritos y soporte offline.

## Estado actual del proyecto

### Integración principal
- Frontend construido con **React + Vite + TailwindCSS**.
- Datos consumidos vía **Apollo Client** desde `http://localhost:4000/graphql`.
- Se usa `localStorage` para persistir el token JWT y se envía automáticamente en el header `Authorization: Bearer TOKEN`.
- El cliente Apollo incluye políticas de caché para evitar conflictos con objetos GraphQL que no tienen `id`.

### Autenticación y roles
- `AuthContext` maneja sesión, token, usuario y los estados:
  - `isAuthenticated`
  - `isAdmin`
  - `isAgent`
- `Login` y `Register` son mutaciones GraphQL.
- Al iniciar la app, si existe token en `localStorage`, se intenta recuperar `me` desde la API.
- `ProtectedRoute` asegura el acceso a rutas privadas y según rol.

### Rutas principales
- Públicas:
  - `/`
  - `/properties`
  - `/properties/:id`
  - `/contact`
- Privadas:
  - `/login`
  - `/register`
  - `/favorites`
  - `/profile`
  - `/admin`

### Funcionalidades implementadas
- **Propiedades públicas**: listado de propiedades y filtros básicos.
- **Detalle de propiedad**: página con datos completos, galería, agente y botón de favoritos.
- **Favoritos**: página renovada con cards responsivas, imagen, precio, detalles de la propiedad y acciones.
- **Perfil**: información de usuario y cierre de sesión.
- **Admin**: panel básico con gestión de usuarios, agentes, propiedades e investigaciones.
- **Carga de agentes**: formulario de agente con selección de imagen local y subida al servidor.
- **Actualización en caliente del admin**: crear/editar/eliminar propiedad refresca la lista automáticamente.

### PWA y offline
- `src/main.jsx` registra el service worker de `public/sw.js` en producción.
- `public/offline.html` se usa como fallback fuera de línea.
- La app guarda `cached_properties` en `localStorage` para cargar datos si falla el backend.
- Como último recurso, se lee `public/properties.json`.
- Nota: `public/manifest.json` aún no está incluido; se recomienda añadirlo para instalación de la PWA.

## Características destacadas de Favoritos
- Página de favoritos rediseñada como catálogo inmobiliario.
- Cada tarjeta muestra:
  - imagen principal
  - estado con badge traducido
  - título
  - ciudad y provincia
  - precio
  - tipo
  - estado
  - habitaciones
  - baños
  - área
  - botón `Ver detalle`
  - botón `Quitar de favoritos`
- Soporte responsive:
  - mobile: 1 columna
  - tablet: 2 columnas
  - desktop: 3 columnas
- Manejo de errores y estado vacío con mensaje profesional.

## Arquitectura general

- Frontend: `React`, `Vite`, `TailwindCSS`
- Routing: `react-router-dom`
- GraphQL: `@apollo/client`, `graphql`
- Autenticación: JWT con `localStorage`
- PWA: Service Worker y offline fallback

## Estructura clave

- `package.json` — scripts y dependencias.
- `src/main.jsx` — arranque de React, ApolloProvider, AuthProvider y BrowserRouter.
- `src/App.jsx` — proveedor de propiedades y router principal.
- `src/graphql/client.js` — configuración de Apollo Client con auth y caché.
- `src/graphql/queries.js` — consultas principales de propiedades, favoritos, usuario y admin.
- `src/graphql/mutations.js` — mutaciones para login, registro, favoritos, propiedades, usuarios e investigaciones.
- `src/context/AuthContext.jsx` — lógica de autenticación y sesión.
- `src/router/AppRouter.jsx` — definiciones de rutas públicas y privadas.
- `src/components/ProtectedRoute.jsx` — validación de acceso por sesión y rol.
- `src/pages/FavoritesPage.jsx` — página de favoritos rediseñada.
- `src/components/FavoritePropertyCard.jsx` — tarjeta profesional de favorito.
- `src/services/favoriteService.js` — consulta y mutaciones de favoritos.
- `src/services/propertyService.js` — carga de propiedades con fallback offline.
- `src/components/LoadingState.jsx` / `src/components/ErrorState.jsx` — estados visuales para carga y errores.

## Dependencias principales

- `react`
- `react-dom`
- `@apollo/client`
- `graphql`
- `react-router-dom`
- `tailwindcss`
- `vite`
- `eslint`
- `gh-pages`

## Cómo ejecutar el proyecto

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Asegúrate de tener la API GraphQL en ejecución en:
   ```bash
   http://localhost:4000/graphql
   ```
3. Inicia el frontend en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Abre la aplicación en el navegador:
   ```bash
   http://localhost:5173/
   ```

## Variables de entorno

- `VITE_GRAPHQL_URL=http://localhost:4000/graphql`

> El archivo `.env` ya está creado en la raíz del proyecto.

## Cómo verificar las funcionalidades

- **Login**: visita `/login` y autentica con credenciales válidas.
- **Registro**: visita `/register` y crea una cuenta.
- **Propiedades**: visita `/properties` para ver el listado desde GraphQL.
- **Detalle de propiedad**: visita `/properties/:id`.
- **Favoritos**: inicia sesión y visita `/favorites`.
- **Perfil**: visita `/profile` después de iniciar sesión.
- **Admin**: inicia sesión como admin y visita `/admin`.
- **Offline**: desconecta la API y verifica que la app intenta usar `cached_properties`.

## Limitaciones actuales

- No existe `public/manifest.json`; la instalación como PWA no está completa.
- El panel de administración es funcional pero aún básico.
- No hay tests automatizados configurados.
- Algunas acciones administrativas todavía requieren mejoras de UX y validación.

## Recomendaciones inmediatas

- Añadir `public/manifest.json` para completar la PWA.
- Implementar tests con Vitest o React Testing Library.
- Añadir validación de formularios en `LoginPage`, `RegisterPage` y consultas.
- Mejorar la experiencia de administración con confirmaciones y feedback en pantalla.
- Crear un build de producción y pipeline de CI para despliegue.

## Resumen rápido

Samara Rentals es una SPA inmobiliaria que ya consume un backend GraphQL real, maneja sesión JWT, protege rutas por rol y ofrece una página de favoritos reforzada con tarjetas de propiedad profesionales. La app conserva soporte offline y tiene un admin básico para gestión de datos.
