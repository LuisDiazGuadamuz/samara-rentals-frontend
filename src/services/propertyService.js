import client from '../graphql/client'
import { GET_PROPERTIES, GET_PROPERTY } from '../graphql/queries'
import { getCachedProperties, savePropertiesToCache } from '../utils/localPropertyCache'

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

    try {
      savePropertiesToCache(properties)
    } catch (cacheError) {
      console.error('Error guardando cache de propiedades:', cacheError)
    }

    return {
      properties: properties.map(normalizeProperty),
      fromCache: false,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    const cached = getCachedProperties()
    if (cached.length > 0) {
      return {
        properties: cached.map(normalizeProperty),
        fromCache: true,
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

        return {
          properties: properties.map(normalizeProperty),
          fromCache: true,
        }
      }
    } catch (_) {
      // ignore
    }

    throw new Error(error.message || 'Error de red al consultar propiedades.')
  }
}

export async function getPropertyById(id, signal) {
  try {
    const { data } = await client.query({ query: GET_PROPERTY, variables: { id }, fetchPolicy: 'network-only' })
    const property = data?.property
    if (!property) throw new Error('Propiedad no encontrada.')

    return {
      property: normalizeProperty(property),
      fromCache: false,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    const cached = getCachedProperties()
    const cachedProperty = cached.find((item) => String(item.id) === String(id))
    if (cachedProperty) {
      return {
        property: normalizeProperty(cachedProperty),
        fromCache: true,
      }
    }

    const { properties, fromCache } = await getProperties(signal)
    const property = properties.find((item) => String(item.id) === String(id))

    if (!property) {
      throw new Error('Propiedad no encontrada.')
    }

    return {
      property,
      fromCache,
    }
  }
}
