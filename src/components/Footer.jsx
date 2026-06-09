import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { MdPhone, MdLocationOn } from 'react-icons/md'
import samaraLogo from '../assets/samara-logo.svg'

function Footer() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <footer className="bg-soft-black text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={samaraLogo}
                alt="Samara Rentals"
                className="h-8 w-auto object-contain filter brightness-0 invert"
              />
              <h3 className="font-heading text-lg font-semibold">Samara Rentals</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Encuentra propiedades exclusivas en Sámara, Carrillo y Nosara. Compra, venta e inversión inmobiliaria en
              algunas de las zonas más atractivas de Guanacaste, Costa Rica.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white/80 transition hover:text-brand">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-white/80 transition hover:text-brand">
                  Propiedades
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/favorites" className="text-white/80 transition hover:text-brand">
                    Favoritos
                  </Link>
                </li>
              )}
              <li>
                <Link to="/contact" className="text-white/80 transition hover:text-brand">
                  Contacto
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link to="/login" className="text-white/80 transition hover:text-brand">
                    Iniciar sesión
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li>
                  <Link to="/profile" className="text-white/80 transition hover:text-brand">
                    Perfil
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-white/80 transition hover:text-brand">
                    Panel Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Coverage Areas */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">
              Zonas de cobertura
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/properties?city=Samara" className="flex items-center gap-2 text-white/80 transition hover:text-brand">
                  <span className="text-lg">📍</span> Sámara
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Carrillo" className="flex items-center gap-2 text-white/80 transition hover:text-brand">
                  <span className="text-lg">📍</span> Carrillo
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Nosara" className="flex items-center gap-2 text-white/80 transition hover:text-brand">
                  <span className="text-lg">📍</span> Nosara
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MdPhone className="mt-0.5 flex-shrink-0 text-brand" />
                <a href="tel:+50683879595" className="text-white/80 transition hover:text-brand">
                  +506 8387 9595
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MdLocationOn className="mt-0.5 flex-shrink-0 text-brand" />
                <div className="text-white/80">
                  <p>Sámara, Guanacaste</p>
                  <p>Costa Rica</p>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/50683879595"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-soft-black transition hover:opacity-90"
            >
              <FaWhatsapp /> Escríbenos por WhatsApp
            </a>
          </div>

          {/* Column 5: Social Media */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-brand">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/samara_rentals?igsh=MmUyNzQ3b2I1Mnlv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-brand hover:text-soft-black"
                title="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/share/1J5qXQ7QQ8/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-brand hover:text-soft-black"
                title="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://wa.me/50683879595"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-brand hover:text-soft-black"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Footer */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between text-sm text-white/70">
          <p>&copy; 2026 Samara Rentals. Todos los derechos reservados.</p>
          <div className="flex flex-col gap-1 sm:text-right">
            <p className="text-xs">Proyecto SPA/PWA desarrollado con:</p>
            <p className="text-xs">React • GraphQL • MongoDB • Cloudinary</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
