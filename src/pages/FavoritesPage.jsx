import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getFavorites, removeFavorite } from '../services/favoriteService'
import FavoritePropertyCard from '../components/FavoritePropertyCard'
import LoadingState from '../components/LoadingState'

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authLoading || !isAuthenticated) return

    async function load() {
      setLoading(true)
      try {
        const data = await getFavorites()
        setFavorites(data)
        setError(null)
      } catch (err) {
        console.error('Favorites loading error', err)
        setError('No se pudieron cargar tus favoritos. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [authLoading, isAuthenticated])

  async function handleRemove(propertyId) {
    setError(null)
    try {
      await removeFavorite(propertyId)
      setFavorites((current) => current.filter((fav) => String(fav.property?.id) !== String(propertyId)))
    } catch (err) {
      console.error('Remove favorite error', err)
      setError('No se pudo quitar el favorito. Intenta otra vez.')
    }
  }

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <LoadingState label="Cargando tus propiedades guardadas..." />
      </main>
    )
  }

  const validFavorites = favorites.filter((fav) => fav?.property)

  if (!validFavorites.length && !error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/70">Favoritos</p>
          <h1 className="mt-4 text-3xl font-heading text-text">No tienes propiedades favoritas todavía</h1>
          <p className="mt-4 text-sm leading-7 text-text/80">Explora el catálogo y guarda las propiedades que más te interesen.</p>
          <Link to="/properties" className="mt-8 inline-flex btn-primary">
            Ver propiedades
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text/70">Favoritos</p>
          <h1 className="mt-3 text-3xl font-heading text-text">Tus propiedades guardadas</h1>
        </div>
        <Link to="/properties" className="inline-flex btn-ghost px-5 py-2">
          Explorar catálogo
        </Link>
      </div>

      {validFavorites.length ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {validFavorites.map((favorite) => (
            <FavoritePropertyCard key={favorite.id} favorite={favorite} onRemove={handleRemove} />
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-text/70">No tienes propiedades favoritas todavía</p>
        </div>
      )}
    </main>
  )
}
