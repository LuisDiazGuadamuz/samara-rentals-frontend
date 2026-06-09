import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return <div className="p-4">Cargando...</div>

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-heading">Perfil</h1>
      <div className="card p-6">
        <div className="space-y-3">
          <div><strong>Nombre:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Rol:</strong> {user.role}</div>
        </div>
        <div className="mt-6">
          <button onClick={logout} className="btn-ghost">Cerrar sesión</button>
        </div>
      </div>
    </main>
  )
}
