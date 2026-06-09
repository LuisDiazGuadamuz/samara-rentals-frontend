import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

function PropertyCard({ property }) {
  // Support both old format (name, location string) and GraphQL format (title, location object)
  const title = property.title || property.name || 'Sin título'
  const locationStr = typeof property.location === 'string' ? property.location : (property.location?.city ? `${property.location.city}, ${property.location.province || ''}` : 'Ubicación desconocida')
  const imageUrl = property.images?.[0] || property.image || '/placeholder.jpg'
  const price = property.price || 0

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="overflow-hidden">
        <img
          src={imageUrl}
          alt={`Imagen de ${title}`}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text/70">{locationStr}</p>
        <h3 className="font-heading text-2xl text-text">{title}</h3>
        <p className="text-lg font-semibold text-brand">{formatCurrency(price)}</p>
        <Link to={`/properties/${property.id}`} className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-semibold text-text transition hover:bg-border/40">
          Ver detalle
        </Link>
      </div>
    </article>
  )
}

export default PropertyCard
