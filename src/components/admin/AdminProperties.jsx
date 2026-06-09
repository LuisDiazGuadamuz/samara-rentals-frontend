import { MdDeleteOutline, MdEdit } from 'react-icons/md'

const statusBadges = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-gray-100 text-gray-800',
  reserved: 'bg-amber-100 text-amber-800'
}

export default function AdminProperties({ properties, agents, onCreate, onEdit, onDelete, onStatusChange, loading, error }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-heading text-text">Propiedades</h2>
          <p className="text-sm text-text/70">Administra el inventario y asigna agentes a cada propiedad.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="btn-primary"
        >
          Nueva propiedad
        </button>
      </div>

      {loading && <div className="card p-6">Cargando propiedades...</div>}
      {error && <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-bg">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Título</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Ciudad</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Tipo</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Estado</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Precio</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Agente</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-bg/40 transition">
                    <td className="px-4 py-4 text-sm font-medium text-text">{property.title}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{property.location?.city || '-'}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{property.type}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadges[property.status]}`}>
                        {property.status === 'available' && 'Disponible'}
                        {property.status === 'sold' && 'Vendida'}
                        {property.status === 'reserved' && 'Reservada'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-brand">{property.currency} {property.price?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{property.agent?.name || <span className="text-gray-400">Sin agente</span>}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => onEdit(property)} className="btn-ghost flex items-center gap-1">
                          <MdEdit className="h-4 w-4" />
                          Editar
                        </button>
                        <button type="button" onClick={() => onDelete(property)} className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200">
                          <MdDeleteOutline className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-sm text-text/70">No hay propiedades registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
