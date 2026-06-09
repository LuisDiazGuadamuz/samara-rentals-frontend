import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import PropertyGallery from '../components/PropertyGallery'
import StatusBadge from '../components/property/StatusBadge'
import PropertyStats from '../components/property/PropertyStats'
import FeatureCard from '../components/property/FeatureCard'
import AgentCard from '../components/property/AgentCard'
import LocationInfo from '../components/property/LocationInfo'
import { getPropertyById } from '../services/propertyService'
import { formatCurrency } from '../utils/format'
import { normalizeFeatures } from '../utils/featureIcons'
import { useAuth } from '../context/AuthContext'
import { addFavorite } from '../services/favoriteService'
import { createInquiry } from '../services/inquiryService'

function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [favLoading, setFavLoading] = useState(false)
  const [inquiryState, setInquiryState] = useState({ name: '', email: '', message: '' })
  const [inquiryStatus, setInquiryStatus] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProperty() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getPropertyById(id, controller.signal)
        setProperty(response)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProperty()

    return () => controller.abort()
  }, [id])

  if (isLoading) {
    return <LoadingState label="Cargando detalle de propiedad..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!property) {
    return <ErrorState message="No fue posible cargar la propiedad seleccionada." />
  }

  const title = property.title || property.name
  const bedrooms = property.bedrooms ?? property.beds
  const bathrooms = property.bathrooms ?? property.baths
  const features = normalizeFeatures(property.features)

  async function handleAddFavorite() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setFavLoading(true)
    try {
      await addFavorite(property.id)
      // optimistic UX: you could show a toast here
    } catch (err) {
      console.error(err)
    } finally {
      setFavLoading(false)
    }
  }

  async function handleInquirySubmit(e) {
    e.preventDefault()
    setInquiryStatus(null)
    const payload = {
      propertyId: property.id,
      name: inquiryState.name || user?.name || '',
      email: inquiryState.email || user?.email || '',
      message: inquiryState.message,
    }

    try {
      await createInquiry(payload)
      setInquiryStatus('success')
      setInquiryState({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setInquiryStatus('error')
    }
  }

  return (
    <main className="space-y-12">
      {/* SECCIÓN 1: GALERÍA */}
      <section>
        <PropertyGallery images={property.images} title={title} />
      </section>

      {/* SECCIÓN 2: INFORMACIÓN PRINCIPAL */}
      <section className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
        <div className="space-y-6">
          {/* Encabezado con título, ubicación y precio */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-sm uppercase tracking-wide text-text/70">
                {property.location?.city || 'Ubicación'} {property.location?.province ? `, ${property.location.province}` : ''}
              </p>
              <StatusBadge status={property.status} />
            </div>
            <h1 className="font-heading text-4xl leading-tight text-text">{title}</h1>
            <p className="mt-4 text-3xl font-semibold text-brand">{formatCurrency(property.price, property.currency)}</p>
          </div>

          {/* SECCIÓN 3: DESCRIPCIÓN */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-text">Descripción</h2>
            <p className="whitespace-pre-wrap leading-relaxed text-text">{property.description}</p>
          </div>

          {/* Estadísticas: Habitaciones, Baños, Área, Tipo */}
          <PropertyStats bedrooms={bedrooms} bathrooms={bathrooms} area={property.area} type={property.type} />

          {/* SECCIÓN 4: UBICACIÓN COMPLETA */}
          <LocationInfo location={property.location} />

          {/* SECCIÓN 5: CARACTERÍSTICAS (FEATURES) */}
          {features && features.length > 0 && (
            <div className="rounded-2xl border border-samara-stone/70 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-samara-charcoal">Características</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <FeatureCard key={feature} feature={feature} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: AGENTE Y FORMULARIO */}
        <aside className="space-y-6">
          {/* SECCIÓN 6: INFORMACIÓN DEL AGENTE */}
          {property.agent && <AgentCard agent={property.agent} />}

          {/* SECCIÓN 7 y 8: FAVORITOS Y CONSULTA */}
          <div className="space-y-3">
            <button onClick={handleAddFavorite} disabled={favLoading} className="btn-primary w-full disabled:opacity-60">
              {favLoading ? 'Guardando...' : '❤ Agregar a favoritos'}
            </button>

            <Link to="/contact" className="btn-ghost block text-center">
              Contactar asesor
            </Link>
          </div>

          {/* FORMULARIO DE CONSULTA */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">Enviar Consulta</h3>
            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text">Nombre</label>
                <input
                  type="text"
                  value={inquiryState.name}
                  onChange={(e) => setInquiryState((s) => ({ ...s, name: e.target.value }))}
                  placeholder={user?.name || 'Tu nombre'}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">Correo</label>
                <input
                  type="email"
                  value={inquiryState.email}
                  onChange={(e) => setInquiryState((s) => ({ ...s, email: e.target.value }))}
                  placeholder={user?.email || 'tu@email.com'}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">Mensaje</label>
                <textarea
                  value={inquiryState.message}
                  onChange={(e) => setInquiryState((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Cuéntanos más..."
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Enviar Consulta
              </button>
              {inquiryStatus === 'success' && (
                <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">Solicitud enviada correctamente.</div>
              )}
              {inquiryStatus === 'error' && (
                <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">Error al enviar la solicitud.</div>
              )}
            </form>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default PropertyDetailPage
