import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  if (isAuthenticated) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const result = await register(name, email, password)
    if (result.ok) {
      navigate('/')
    } else {
      setError('No se pudo registrar')
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-4 text-2xl font-heading">Registro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text">Correo</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <button disabled={loading} className="btn-primary w-full">{loading ? 'Cargando...' : 'Crear cuenta'}</button>
          </div>
        </form>
      </div>
    </main>
  )
}
