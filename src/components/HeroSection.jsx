import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card sm:p-12">
      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-brand/30 opacity-30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-tropical/20 opacity-20 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-border bg-bg px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-text">
            Propiedades en venta
          </span>
          <h1 className="mt-5 font-heading text-4xl leading-tight text-text sm:text-5xl">
            Encuentra tu próxima inversión en la costa con confianza.
          </h1>
          <p className="mt-4 max-w-xl text-base text-text/80 sm:text-lg">
            Samara Rentals conecta compradores con hogares y residencias premium en Sámara, Carrillo y Nosara.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/properties" className="btn-primary">
              Ver propiedades
            </Link>

            <Link to="/contact" className="btn-ghost">
              Contactar
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            alt="Residencia moderna con piscina"
            className="h-72 w-full object-cover sm:h-96"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
