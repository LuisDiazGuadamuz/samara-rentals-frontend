import { MdDeleteOutline } from 'react-icons/md'

export default function AdminInquiries({ inquiries, onDelete, loading, error }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-heading text-text">Solicitudes</h2>
          <p className="text-sm text-text/70">Revisa las consultas recibidas y elimina las que ya se hayan atendido.</p>
        </div>
      </div>

      {loading && <div className="card p-6">Cargando solicitudes...</div>}
      {error && <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-bg">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Nombre</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Mensaje</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Propiedad</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Usuario</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-bg/40 transition">
                    <td className="px-4 py-4 text-sm font-medium text-text">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{item.email}</td>
                    <td className="px-4 py-4 text-sm text-text/70 max-w-sm truncate" title={item.message}>{item.message}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{item.property?.title || '-'}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{item.user?.email || '-'}</td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => onDelete(item)} className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200">
                        <MdDeleteOutline className="h-4 w-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-sm text-text/70">No hay solicitudes registradas.</td>
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
