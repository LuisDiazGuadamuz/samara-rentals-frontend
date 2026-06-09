import client from '../graphql/client'
import { GET_PROPERTIES, GET_PROPERTY } from '../graphql/queries'

const API_URL = `${import.meta.env.BASE_URL}properties.json`

function resolveAssetUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return imageUrl
  }

  // Keep external URLs unchanged.
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  const normalizedPath = imageUrl.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalizedPath}`
}

function normalizeProperty(property) {
  if (!property) return property

  return {
    ...property,
    images: Array.isArray(property.images) ? property.images.map(resolveAssetUrl) : [],
  }
}

export async function getProperties(signal) {
  try {
    const { data } = await client.query({ query: GET_PROPERTIES, fetchPolicy: 'network-only' })
    const properties = data?.properties ?? []
    // cache for offline usage
    try {
      localStorage.setItem('cached_properties', JSON.stringify(properties))
    } catch (e) {
      // ignore
    }
    return properties.map(normalizeProperty)
  } catch (error) {
    // On error, try to fall back to cached properties or the old static file
    const cached = localStorage.getItem('cached_properties')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return parsed.map(normalizeProperty)
      } catch (e) {
        // ignore
      }
    }

    // last resort: static properties.json
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal,
      })

      if (response.ok) {
        const data = await response.json()
        const properties = data.properties ?? []
        return properties.map(normalizeProperty)
      }
    } catch (_) {
      // ignore
    }

    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(error.message || 'Error de red al consultar propiedades.')
  }
}

export async function getPropertyById(id, signal) {
  try {
    const { data } = await client.query({ query: GET_PROPERTY, variables: { id }, fetchPolicy: 'network-only' })
    const property = data?.property
    if (!property) throw new Error('Propiedad no encontrada.')
    return normalizeProperty(property)
  } catch (error) {
    // fallback to listing and find
    const properties = await getProperties(signal)
    const property = properties.find((item) => String(item.id) === String(id))

    if (!property) {
      throw new Error('Propiedad no encontrada.')
    }

    return property
  }
}
