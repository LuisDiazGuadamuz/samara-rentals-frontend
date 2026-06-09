/**
 * Upload service for property images
 * Handles file upload to backend REST API (Cloudinary integration)
 */

export async function uploadPropertyImages(files, token) {
  if (!files || files.length === 0) {
    return []
  }

  if (!token) {
    throw new Error('Token de autenticación inválido para subir imágenes')
  }

  const fileArray = Array.from(files)

  // Validate max 10 images
  if (fileArray.length > 10) {
    throw new Error('Máximo 10 imágenes permitidas')
  }

  const formData = new FormData()

  // Append each file with the key "images"
  fileArray.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} no es una imagen válida`)
    }
    formData.append('images', file)
  })

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const response = await fetch(`${apiUrl}/upload/properties`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    })

    if (!response.ok) {
      const responseText = await response.text().catch(() => '')
      let errorMessage = `Error HTTP ${response.status}`

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorMessage
      } catch {
        if (responseText) {
          errorMessage = `${errorMessage}: ${responseText}`
        }
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Backend can return urls, images, or data.images
    const uploadedUrls = data.urls || data.images || data.data?.images || []

    if (!Array.isArray(uploadedUrls)) {
      throw new Error('Respuesta del servidor inválida')
    }

    return uploadedUrls
  } catch (error) {
    console.error('Error uploading images:', error)
    throw new Error(error.message || 'Error al cargar las imágenes')
  }
}

export async function uploadAgentPhoto(file, token) {
  if (!file) {
    return ''
  }

  if (!token) {
    throw new Error('Token de autenticación inválido para subir la foto del agente')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten archivos de imagen para la foto del agente')
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('La imagen del agente supera el tamaño máximo de 5 MB')
  }

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const response = await fetch(`${apiUrl}/upload/agents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const responseText = await response.text().catch(() => '')
    let data = {}

    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch {
      // ignore parse error
    }

    if (!response.ok) {
      const errorMessage = data.message || `Error HTTP ${response.status}`
      throw new Error(errorMessage)
    }

    const photoUrl = data.url || data.photo
    if (!photoUrl) {
      throw new Error('La respuesta del servidor no incluyó la URL de la foto')
    }

    return photoUrl
  } catch (error) {
    console.error('Error uploading agent photo:', error)
    throw new Error(error.message || 'Error al subir la foto del agente')
  }
}
