import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'
import StatusBadge from './property/StatusBadge'

export default function FavoritePropertyCard({ favorite, onRemove }) {
  const property = favorite?.property
  const title = property?.title || 'Propiedad sin título'
  const imageUrl = property?.images?.[0]
  const locationLabel = property?.location?.city
    ? `${property.location.city}, ${property.location.province || ''}`
    : 'Ubicación desconocida'

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="relative overflow-hidden bg-bg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Imagen de ${title}`}
            className="h-60 w-full object-cover object-center transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-60 w-full items-center justify-center border-b border-samara-stone/70 bg-samara-ivory text-sm text-samara-ash">
            Sin imagen disponible
          </div>
        )}
        <div className="absolute right-4 top-4">
          <StatusBadge status={property?.status} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-text/70">{locationLabel}</p>
          <h3 className="font-heading text-xl text-text">{title}</h3>
          <p className="text-lg font-semibold text-brand">{formatCurrency(property?.price ?? 0)}</p>
        </div>

        <div className="grid gap-2 text-sm text-text sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg px-3 py-2">Tipo: {property?.type ?? '—'}</div>
          <div className="rounded-2xl border border-border bg-bg px-3 py-2">Estado: {property?.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : '—'}</div>
          <div className="rounded-2xl border border-border bg-bg px-3 py-2">Hab: {property?.bedrooms ?? '—'}</div>
          <div className="rounded-2xl border border-border bg-bg px-3 py-2">Baños: {property?.bathrooms ?? '—'}</div>
          <div className="rounded-2xl border border-border bg-bg px-3 py-2 col-span-full">Área: {property?.area ? `${property.area} m²` : '—'}</div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to={`/properties/${property?.id}`} className="inline-flex w-full items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-text transition hover:bg-border/40 sm:w-auto">
            Ver detalle
          </Link>
          <button type="button" onClick={() => onRemove(property?.id)} className="inline-flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto">
            Quitar de favoritos
          </button>
        </div>
      </div>
    </article>
  )
}
