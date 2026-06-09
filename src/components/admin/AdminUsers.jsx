import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MdDeleteOutline } from 'react-icons/md'

const roles = ['user', 'agent', 'admin']

const roleColors = {
  user: 'bg-blue-100 text-blue-800',
  agent: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800'
}

export default function AdminUsers({ users, onRoleChange, onDeleteUser, loading, error }) {
  const { user } = useAuth()

  const header = ['Nombre', 'Correo', 'Role', 'Acciones']

  const rows = useMemo(
    () => users.map((u) => ({
      ...u,
      isSelf: user?.id === u.id
    })),
    [users, user]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-heading text-text">Usuarios</h2>
          <p className="text-sm text-text/70">Administra roles y elimina usuarios con cuidado.</p>
        </div>
      </div>

      {loading && <div className="card p-6">Cargando usuarios...</div>}
      {error && <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-left">
              <thead className="bg-bg">
                <tr>
                  {header.map((label) => (
                    <th key={label} className="px-4 py-3 text-sm font-semibold text-text/70">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-bg/40 transition">
                    <td className="px-4 py-4 text-sm font-medium text-text">{userItem.name}</td>
                    <td className="px-4 py-4 text-sm text-text/70">{userItem.email}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${roleColors[userItem.role]}`}>
                        {userItem.role}
                      </span>
                      {userItem.isSelf && <span className="ml-2 text-xs font-medium text-brand">(Tú)</span>}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onDeleteUser(userItem)}
                        disabled={userItem.isSelf}
                        className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MdDeleteOutline className="h-4 w-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-sm text-text/70">No hay usuarios registrados.</td>
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
