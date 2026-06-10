import { useEffect, useMemo, useState } from 'react'
import { getProperties } from '../services/propertyService'
import { sanitizeInput } from '../utils/sanitize'


export function useProperties() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [usingCachedData, setUsingCachedData] = useState(false)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [maxPrice, setMaxPrice] = useState('all')

  async function loadProperties(signal) {
    setIsLoading(true)
    setError('')

    try {
      const { properties: fetchedProperties, fromCache } = await getProperties(signal)
      setProperties(fetchedProperties)
      setUsingCachedData(fromCache)
    } catch (fetchError) {
      if (fetchError.name !== 'AbortError') {
        setError(fetchError.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadProperties(controller.signal)

    return () => controller.abort()
  }, [])

  useEffect(() => {
    function handleOnline() {
      const controller = new AbortController()
      loadProperties(controller.signal)
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
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

      const normalizedLocation = String(property._location || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
      const normalizedFilter = String(location || '')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()

      const byLocation = location === 'all' || normalizedLocation === normalizedFilter

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
    usingCachedData,
    search,
    setSearch,
    location,
    setLocation,
    maxPrice,
    setMaxPrice,
  }
}
