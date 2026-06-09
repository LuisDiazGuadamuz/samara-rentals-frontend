import { useEffect, useMemo, useState } from 'react'
import { getProperties } from '../services/propertyService'
import { sanitizeInput } from '../utils/sanitize'

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [maxPrice, setMaxPrice] = useState('all')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProperties() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getProperties(controller.signal)
        setProperties(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()

    return () => controller.abort()
  }, [])

  const normalized = useMemo(() => {
    return properties.map((p) => {
      const name = p.title || p.name || ''
      const loc = p.location && typeof p.location === 'string' ? p.location : p.location?.city || p.location?.province || ''
      const price = p.price ?? 0
      return { ...p, _name: name, _location: loc, _price: price }
    })
  }, [properties])

  const filteredProperties = useMemo(() => {
    return normalized.filter((property) => {
      const byName = property._name.toLowerCase().includes(sanitizeInput(search).toLowerCase())

      const byLocation = location === 'all' || (property._location || '').toLowerCase() === location.toLowerCase()

      const byPrice = maxPrice === 'all' || property._price <= Number(maxPrice)

      return byName && byLocation && byPrice
    })
  }, [normalized, search, location, maxPrice])

  const locations = useMemo(() => {
    return ['all', ...new Set(normalized.map((property) => property._location).filter(Boolean))]
  }, [normalized])

  return {
    properties: normalized,
    filteredProperties,
    locations,
    isLoading,
    error,
    search,
    setSearch,
    location,
    setLocation,
    maxPrice,
    setMaxPrice,
  }
}
