import { useEffect, useState } from 'react'
import { uploadPropertyImages } from '../../services/uploadService'
import { useAuth } from '../../context/AuthContext'
import { MdClose, MdImage } from 'react-icons/md'

const initialForm = {
  title: '',
  description: '',
  price: '',
  currency: 'USD',
  country: '',
  province: '',
  city: '',
  address: '',
  lat: '',
  lng: '',
  type: 'house',
  status: 'available',
  bedrooms: '',
  bathrooms: '',
  area: '',
  featuresText: '',
  agentId: ''
}

const getInitialFormData = (property) => ({
  title: property?.title || '',
  description: property?.description || '',
  price: property?.price?.toString() || '',
  currency: property?.currency || 'USD',
  country: property?.location?.country || '',
  province: property?.location?.province || '',
  city: property?.location?.city || '',
  address: property?.location?.address || '',
  lat: property?.location?.coordinates?.lat?.toString() || '',
  lng: property?.location?.coordinates?.lng?.toString() || '',
  type: property?.type || 'house',
  status: property?.status || 'available',
  bedrooms: property?.bedrooms?.toString() || '',
  bathrooms: property?.bathrooms?.toString() || '',
  area: property?.area?.toString() || '',
  featuresText: Array.isArray(property?.features) ? property.features.join(', ') : '',
  agentId: property?.agent?.id || property?.agentId || ''
})

const typeOptions = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' }
]

const statusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendida' },
  { value: 'reserved', label: 'Reservada' }
]

export default function PropertyFormModal({ open, onClose, onSubmit, initialData, agents, isSaving, error }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [currentImageUrls, setCurrentImageUrls] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData(initialData))
      setCurrentImageUrls(initialData.images || [])
      setSelectedFiles([])
      setPreviewUrls([])
    } else {
      setFormData(initialForm)
      setCurrentImageUrls([])
      setSelectedFiles([])
      setPreviewUrls([])
    }
    setImageUploadError('')
  }, [initialData, open])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    setImageUploadError('')

    if (files.length > 0) {
      const existingSelectedFiles = selectedFiles || []
      const totalImages = currentImageUrls.length + existingSelectedFiles.length + files.length
      if (totalImages > 10) {
        setImageUploadError(
          `No puedes subir más de 10 imágenes en total. Actualmente tienes ${currentImageUrls.length + existingSelectedFiles.length}.`
        )
        e.target.value = ''
        return
      }

      const newSelectedFiles = [...existingSelectedFiles, ...files]
      setSelectedFiles(newSelectedFiles)

      const newPreviews = [...previewUrls, ...files.map((file) => URL.createObjectURL(file))]
      setPreviewUrls(newPreviews)
      e.target.value = ''
    }
  }

  const removeCurrentImage = (index) => {
    setCurrentImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removePreviewImage = (index) => {
    setPreviewUrls((prev) => {
      const removedUrl = prev[index]
      if (removedUrl) URL.revokeObjectURL(removedUrl)
      return prev.filter((_, i) => i !== index)
    })

    setSelectedFiles((prev) => {
      if (!prev) return null
      const newFiles = prev.filter((_, i) => i !== index)
      return newFiles.length > 0 ? newFiles : []
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.description.trim() || !formData.city.trim() || !formData.type || !formData.status || !formData.agentId) {
      return
    }

    // Upload new images if any selected
    let finalImageUrls = [...currentImageUrls]
    if (selectedFiles && selectedFiles.length > 0) {
      setUploadingImages(true)
      setImageUploadError('')
      try {
        const uploadedUrls = await uploadPropertyImages(selectedFiles, user?.token || localStorage.getItem('token'))
        finalImageUrls = [...finalImageUrls, ...uploadedUrls]
      } catch (err) {
        setImageUploadError(err.message)
        setUploadingImages(false)
        return
      }
      setUploadingImages(false)
    }

    const locationData = {
      country: formData.country.trim(),
      province: formData.province.trim(),
      city: formData.city.trim(),
      address: formData.address.trim()
    }

    const coordinates = {}
    if (formData.lat.trim() !== '') coordinates.lat = Number(formData.lat)
    if (formData.lng.trim() !== '') coordinates.lng = Number(formData.lng)
    if (Object.keys(coordinates).length) locationData.coordinates = coordinates

    const input = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      currency: formData.currency.trim() || 'USD',
      location: Object.keys(locationData).some((key) => locationData[key]) ? locationData : undefined,
      type: formData.type,
      status: formData.status,
      bedrooms: formData.bedrooms.trim() ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms.trim() ? Number(formData.bathrooms) : undefined,
      area: formData.area.trim() ? Number(formData.area) : undefined,
      features: formData.featuresText.trim()
        ? formData.featuresText.split(',').map((item) => item.trim()).filter(Boolean)
        : undefined,
      images: finalImageUrls.length > 0 ? finalImageUrls : undefined,
      agentId: formData.agentId
    }

    onSubmit(input)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/40 px-4 py-6">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-heading text-text">{initialData ? 'Editar propiedad' : 'Nueva propiedad'}</h2>
            <p className="text-sm text-text/70">Rellena los datos y selecciona el agente responsable.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost">Cerrar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 rounded-lg border border-border/50 bg-bg/50 p-4">
            <h3 className="text-sm font-heading text-text">Información General</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-text/80">
                Título
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Precio (USD)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
          </div>

          <label className="space-y-1 text-xs font-medium text-text/80">
            Descripción
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
              required
            />
          </label>

          <div className="space-y-2 rounded-lg border border-border/50 bg-bg/50 p-4">
            <h3 className="text-sm font-heading text-text">Ubicación</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-text/80">
                Ciudad
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Dirección
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-text/80">
                País
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Provincia
                <input
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-text/80">
              Latitud
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                step="0.000001"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-text/80">
              Longitud
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                step="0.000001"
              />
            </label>
          </div>

          <div className="space-y-2 rounded-lg border border-border/50 bg-bg/50 p-4">
            <h3 className="text-sm font-heading text-text">Propiedades</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1 text-xs font-medium text-text/80">
                Tipo
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Estado
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Agente
                <select
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                >
                  <option value="">Selecciona un agente</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.email})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border/50 bg-bg/50 p-4">
            <h3 className="text-sm font-heading text-text">Especificaciones</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1 text-xs font-medium text-text/80">
                Dormitorios
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  min="0"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Baños
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  min="0"
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Área m²
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
          </div>

          <label className="space-y-1 text-xs font-medium text-text/80">
            Amenidades (separadas por coma)
            <input
              name="featuresText"
              value={formData.featuresText}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
              placeholder="piscina, jardín, wifi, aire acondicionado"
            />
          </label>

          {/* IMAGES SECTION */}
          <div className="space-y-3 rounded-lg border border-border/50 bg-bg/50 p-4">
            <div className="flex items-center gap-2">
              <MdImage className="h-5 w-5 text-brand" />
              <h3 className="text-sm font-heading text-text">Imágenes ({currentImageUrls.length + previewUrls.length}/10)</h3>
            </div>

            <label className="block cursor-pointer">
              <div className="rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition hover:border-brand hover:bg-bg/50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploadingImages}
                  className="hidden"
                />
                <MdImage className="mx-auto h-8 w-8 text-brand/60" />
                <p className="mt-2 text-sm font-medium text-text">Selecciona imágenes</p>
                <p className="mt-1 text-xs text-text/60">Arrastra o haz clic. Máximo 10 imágenes totales.</p>
              </div>
            </label>

            {/* Current images from database */}
            {currentImageUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-text/60">Imágenes existentes</p>
                <div className="grid gap-2 sm:grid-cols-4">
                  {currentImageUrls.map((url, idx) => (
                    <div key={`current-${idx}`} className="group relative overflow-hidden rounded-lg border border-border shadow-sm">
                      <img src={url} alt={`Imagen ${idx + 1}`} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeCurrentImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                        title="Eliminar imagen"
                      >
                        <MdClose className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview of selected files */}
            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-text/60">Nuevas imágenes</p>
                <div className="grid gap-2 sm:grid-cols-4">
                  {previewUrls.map((url, idx) => (
                    <div key={`preview-${idx}`} className="group relative overflow-hidden rounded-lg border border-brand/50 bg-brand/5 shadow-sm">
                      <img src={url} alt={`Preview ${idx + 1}`} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePreviewImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                        title="Eliminar imagen"
                      >
                        <MdClose className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadingImages && (
              <p className="text-sm text-brand font-medium">Subiendo imágenes...</p>
            )}

            {imageUploadError && (
              <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{imageUploadError}</p>
            )}
          </div>

          {error && <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || uploadingImages}
              className="btn-primary disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : uploadingImages ? 'Subiendo imágenes...' : initialData ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
