import { MdLocationOn, MdPublic } from 'react-icons/md'

export default function LocationInfo({ location }) {
  if (!location) return null

  const address = location.address || ''
  const city = location.city || ''
  const province = location.province || ''
  const country = location.country || ''
  const coordinates = location.coordinates

  const hasCoordinates = coordinates && coordinates.lat && coordinates.lng

  return (
    <div className="rounded-2xl border border-samara-stone/70 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-samara-charcoal">Ubicación</h3>

      <div className="space-y-3">
        {address && (
          <div className="flex gap-3">
            <MdLocationOn className="h-5 w-5 flex-shrink-0 text-samara-gold" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">Dirección</p>
              <p className="mt-1 text-sm text-samara-charcoal">{address}</p>
            </div>
          </div>
        )}

        {city && (
          <div className="flex gap-3">
            <MdLocationOn className="h-5 w-5 flex-shrink-0 text-samara-gold" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">Ciudad</p>
              <p className="mt-1 text-sm text-samara-charcoal">{city}</p>
            </div>
          </div>
        )}

        {province && (
          <div className="flex gap-3">
            <MdLocationOn className="h-5 w-5 flex-shrink-0 text-samara-gold" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">Provincia</p>
              <p className="mt-1 text-sm text-samara-charcoal">{province}</p>
            </div>
          </div>
        )}

        {country && (
          <div className="flex gap-3">
            <MdPublic className="h-5 w-5 flex-shrink-0 text-samara-gold" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">País</p>
              <p className="mt-1 text-sm text-samara-charcoal">{country}</p>
            </div>
          </div>
        )}

        {hasCoordinates && (
          <div className="mt-4 space-y-2 rounded-lg bg-samara-ivory p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-samara-ash">Coordenadas GPS</p>
            <p className="text-sm text-samara-charcoal">
              <strong>Lat:</strong> {coordinates.lat.toFixed(6)}
            </p>
            <p className="text-sm text-samara-charcoal">
              <strong>Lng:</strong> {coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

