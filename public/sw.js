const VERSION = 'v3'
const STATIC_CACHE = `samara-static-${VERSION}`
const API_CACHE = `samara-api-${VERSION}`

// Derive base path where the SW is located (works with GitHub Pages subdirectory)
const BASE_PATH = (() => {
  const url = new URL(self.location.href)
  const pathname = url.pathname
  return pathname.endsWith('/sw.js') ? pathname.replace(/sw\.js$/, '') : pathname
})()

const OFFLINE_URL = `${BASE_PATH}offline.html`
const GRAPHQL_HOST = 'samara-rentals-api.onrender.com'

const STATIC_ASSETS = [
  `${BASE_PATH}`,
  `${BASE_PATH}index.html`,
  OFFLINE_URL,
  `${BASE_PATH}favicon.svg`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icons/icon-192.png`,
  `${BASE_PATH}icons/icon-512.png`,
  `${BASE_PATH}icons/maskable-icon-192.png`,
  `${BASE_PATH}icons/maskable-icon-512.png`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, API_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      )
    }),
  )
  self.clients.claim()
})

// Helpers
function isGraphQLRequest(url, request) {
  try {
    const u = new URL(request.url)
    return u.hostname === GRAPHQL_HOST || request.url.includes('/graphql') || (request.headers.get('content-type') || '').includes('application/graphql')
  } catch (e) {
    return false
  }
}

function isAssetRequest(url, request) {
  const extMatch = url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|json|ico|map|woff2?)$/i)
  const dest = request.destination || ''
  return extMatch || dest === 'script' || dest === 'style' || dest === 'image' || dest === 'font' || url.pathname.includes('/icons/') || url.pathname.endsWith('/manifest.json')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Ignore GraphQL / API requests — let network (and Apollo) handle them.
  if (isGraphQLRequest(url, request)) {
    return
  }

  // API endpoints (like properties.json)
  if (url.pathname.endsWith('/properties.json')) {
    event.respondWith(networkFirstForApi(request))
    return
  }

  // SPA navigation — network first, fall back to cached app shell (index.html) or offline.html
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstForNavigation(request))
    return
  }

  // Static assets: cache-first (don't return index.html for these)
  if (isAssetRequest(url, request)) {
    event.respondWith(cacheFirstForAssets(request))
    return
  }

  // Default: try network then fallback to cache/or offline
  event.respondWith(networkWithOfflineFallback(request))
})

async function cacheFirstForAssets(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response && response.ok) cache.put(request, response.clone())
    return response
  } catch (e) {
    // do not return index.html for asset failures — return offline page for navigations only
    return cache.match(OFFLINE_URL)
  }
}

async function networkFirstForApi(request) {
  const cache = await caches.open(API_CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh && fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) return cached
    return new Response(JSON.stringify({ properties: [] }), { headers: { 'Content-Type': 'application/json' }, status: 200 })
  }
}

async function networkWithOfflineFallback(request) {
  const cache = await caches.open(STATIC_CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh && fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch (err) {
    const cached = await cache.match(request)
    const indexFallback = await cache.match(`${BASE_PATH}index.html`) || await cache.match(BASE_PATH)
    return cached || indexFallback || cache.match(OFFLINE_URL)
  }
}

async function networkFirstForNavigation(request) {
  const cache = await caches.open(STATIC_CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh && fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch (err) {
    // Return cached index/app-shell if available, otherwise offline
    const indexFallback = await cache.match(`${BASE_PATH}index.html`) || await cache.match(BASE_PATH)
    return indexFallback || cache.match(OFFLINE_URL)
  }
}
