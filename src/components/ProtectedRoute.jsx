import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin, requireAgent }) {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8 text-center">
        <p className="text-base font-medium text-samara-navy">Cargando sesión...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />
  if (requireAgent && !(isAgent || isAdmin)) return <Navigate to="/" replace />

  return children
}
