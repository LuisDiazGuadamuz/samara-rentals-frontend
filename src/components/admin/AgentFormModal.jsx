import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { uploadAgentPhoto } from '../../services/uploadService'
import { MdPhoto, MdClose } from 'react-icons/md'

const initialState = {
  name: '',
  email: '',
  phone: '',
  photo: ''
}

export default function AgentFormModal({ open, onClose, onSubmit, initialData, isSaving, error }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState(initialState)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        photo: initialData.photo || ''
      })
    } else {
      setFormData(initialState)
    }

    setSelectedFile(null)
    setPreviewUrl('')
    setUploadingPhoto(false)
    setPhotoError('')
  }, [initialData, open])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0]
    setPhotoError('')

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('Solo se permiten archivos de imagen (JPG, PNG, WebP).')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setPhotoError('La imagen supera el tamaño máximo de 5 MB.')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      return
    }

    let photoUrl = formData.photo || ''

    if (selectedFile) {
      setUploadingPhoto(true)
      setPhotoError('')
      try {
        photoUrl = await uploadAgentPhoto(selectedFile, user?.token || localStorage.getItem('token'))
      } catch (uploadError) {
        setPhotoError(uploadError.message)
        setUploadingPhoto(false)
        return
      }
      setUploadingPhoto(false)
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      photo: photoUrl
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-heading text-text">{initialData ? 'Editar agente' : 'Nuevo agente'}</h2>
            <p className="text-sm text-text/70">Completa los datos del agente y guarda los cambios.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost">Cerrar</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 rounded-lg border border-border/50 bg-bg/50 p-4">
            <h3 className="text-sm font-heading text-text">Información del Agente</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-text/80">
                Nombre
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80">
                Correo
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                  required
                />
              </label>
              <label className="space-y-1 text-xs font-medium text-text/80 sm:col-span-2">
                Teléfono
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                />
              </label>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-border/50 bg-bg/50 p-4">
            <div className="flex items-center gap-2">
              <MdPhoto className="h-5 w-5 text-brand" />
              <h3 className="text-sm font-heading text-text">Foto de Perfil</h3>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm bg-bg">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview foto" className="h-full w-full object-cover" />
                ) : formData.photo ? (
                  <img src={formData.photo} alt={formData.name || 'Foto del agente'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <MdPhoto className="h-8 w-8 text-brand/40" />
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-brand bg-brand/5 px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/10">
                  Cambiar foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-text/60">JPG, PNG o WebP. Máximo 5 MB.</p>
                {photoError && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{photoError}</p>}
                {uploadingPhoto && <p className="text-sm font-medium text-brand">Subiendo foto...</p>}
              </div>
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-border pt-4">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={isSaving || uploadingPhoto} className="btn-primary disabled:opacity-60">
              {isSaving ? 'Guardando...' : uploadingPhoto ? 'Subiendo foto...' : 'Guardar agente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
