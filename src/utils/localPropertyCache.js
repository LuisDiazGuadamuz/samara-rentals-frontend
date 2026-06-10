const PROPERTIES_CACHE_KEY = 'cached_properties'
const PROPERTIES_CACHE_DATE_KEY = 'cached_properties_updated_at'

export function savePropertiesToCache(properties) {
  if (!Array.isArray(properties)) return

  try {
    localStorage.setItem(PROPERTIES_CACHE_KEY, JSON.stringify(properties))
    localStorage.setItem(PROPERTIES_CACHE_DATE_KEY, new Date().toISOString())
  } catch (error) {
    console.error('Error guardando propiedades cacheadas:', error)
  }
}

export function getCachedProperties() {
  try {
    const raw = localStorage.getItem(PROPERTIES_CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('Error leyendo propiedades cacheadas:', error)
    return []
  }
}

export function getCachedPropertiesDate() {
  try {
    return localStorage.getItem(PROPERTIES_CACHE_DATE_KEY)
  } catch (error) {
    console.error('Error leyendo fecha de cache de propiedades:', error)
    return null
  }
}
