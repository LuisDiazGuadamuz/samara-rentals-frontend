import { NavLink } from 'react-router-dom'
import samaraLogo from '../assets/samara-logo.svg'
import { useAuth } from '../context/AuthContext'
import InstallPWA from './InstallPWA'

function Navbar() {
  const { isAuthenticated, isAdmin, isAgent, user, logout } = useAuth()

  const common = [
    { to: '/', label: 'Inicio' },
    { to: '/properties', label: 'Propiedades' },
    { to: '/contact', label: 'Contactenos' },
  ]

  const guest = [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Registro' },
  ]

  const userLinks = [
    { to: '/favorites', label: 'Favoritos' },
    { to: '/profile', label: 'Perfil' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b bg-bg/95 border-border backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:justify-between sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          aria-label="Ir al inicio de Samara Real Estate"
        >
          <img
            src={samaraLogo}
            alt="Samara Real Estate"
            className="h-12 w-auto object-contain sm:h-14 lg:h-16"
          />
          <span className="hidden font-heading text-lg font-semibold text-text sm:inline-block">Samara Rentals</span>
        </NavLink>

        <ul className="ml-4 mr-auto flex flex-wrap items-center gap-2 sm:ml-8 sm:gap-4">
          {common.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-4 ${isActive ? 'bg-soft-black text-white shadow-sm' : 'text-text hover:bg-border/40'}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {!isAuthenticated &&
            guest.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                      isActive
                        ? 'bg-samara-charcoal text-white'
                        : 'text-samara-ash hover:bg-samara-stone/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

          {isAuthenticated &&
            userLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                      isActive
                        ? 'bg-samara-charcoal text-white'
                        : 'text-samara-ash hover:bg-samara-stone/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

          {isAgent && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'bg-samara-charcoal text-white rounded-full px-3 py-2 text-sm font-semibold' : 'text-samara-ash hover:bg-samara-stone/50 rounded-full px-3 py-2 text-sm font-semibold')}>
                Panel Agente
              </NavLink>
            </li>
          )}

          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'bg-samara-charcoal text-white rounded-full px-3 py-2 text-sm font-semibold' : 'text-samara-ash hover:bg-samara-stone/50 rounded-full px-3 py-2 text-sm font-semibold')}>
                Admin
              </NavLink>
            </li>
          )}

          {isAuthenticated && (
            <li>
              <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-semibold text-text hover:bg-border/40">
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>

        <div className="flex items-center justify-center sm:justify-end">
          <InstallPWA />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
