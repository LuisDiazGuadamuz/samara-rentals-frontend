import { useState } from 'react'
import { MdImageNotSupported } from 'react-icons/md'

function PropertyGallery({ images, title }) {
  const validImages = Array.isArray(images) && images.filter((img) => img && String(img).trim())
  const hasImages = validImages && validImages.length > 0
  const [activeImage, setActiveImage] = useState(hasImages ? validImages[0] : null)

  if (!hasImages) {
    return (
      <section className="space-y-4">
        <div className="flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-samara-stone/50 bg-samara-ivory sm:h-[420px]">
          <div className="flex flex-col items-center gap-3 text-samara-ash">
            <MdImageNotSupported className="text-4xl" />
            <p className="text-sm font-medium">Sin imágenes disponibles</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-samara-stone/70 bg-black shadow-lg">
        <img
          src={activeImage}
          alt={`Imagen principal de ${title}`}
          className="h-80 w-full object-cover sm:h-[420px]"
        />
      </div>

      {validImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {validImages.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`overflow-hidden rounded-xl border-2 transition ${
                activeImage === image ? 'border-samara-gold shadow-md' : 'border-samara-stone/70 hover:border-samara-stone'
              }`}
              aria-label={`Ir a imagen ${idx + 1}`}
            >
              <img src={image} alt={`Miniatura ${idx + 1} de ${title}`} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default PropertyGallery
