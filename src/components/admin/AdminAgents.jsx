import { MdDeleteOutline, MdEdit } from 'react-icons/md'

export default function AdminAgents({ agents, onCreate, onEdit, onDelete, loading, error }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-heading text-text">Agentes</h2>
          <p className="text-sm text-text/70">Crea y administra los agentes encargados de las propiedades.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="btn-primary"
        >
          Nuevo agente
        </button>
      </div>

      {loading && <div className="card p-6">Cargando agentes...</div>}
      {error && <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-bg">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Nombre</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Correo</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Teléfono</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Foto</th>
                  <th className="px-4 py-3 text-sm font-semibold text-text/70">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-bg/40 transition">
                    <td className="px-4 py-4 text-sm font-medium text-text">{agent.name}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{agent.email}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{agent.phone || '-'}</td>
                    <td className="px-4 py-4">
                      {agent.photo ? (
                        <img src={agent.photo} alt={agent.name} className="h-10 w-10 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-xs font-semibold text-brand">
                          {agent.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => onEdit(agent)} className="btn-ghost flex items-center gap-1">
                          <MdEdit className="h-4 w-4" />
                          Editar
                        </button>
                        <button type="button" onClick={() => onDelete(agent)} className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200">
                          <MdDeleteOutline className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {agents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-sm text-text/70">No hay agentes registrados.</td>
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
