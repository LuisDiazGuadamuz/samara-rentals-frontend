import React, { createContext, useContext, useEffect, useState } from 'react'
import client from '../graphql/client'
import { ME } from '../graphql/queries'
import { LOGIN, REGISTER } from '../graphql/mutations'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(!!token)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return setLoading(false)

    // Try to load current user
    loadMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadMe() {
    setLoading(true)
    try {
      const { data } = await client.query({ query: ME, fetchPolicy: 'network-only' })
      setUser(data.me)
      setError(null)
    } catch (err) {
      console.error('loadMe error', err)
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    setLoading(true)
    try {
      const { data } = await client.mutate({ mutation: LOGIN, variables: { input: { email, password } } })
      const { token: newToken, user: loggedUser } = data.login
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(loggedUser)
      setError(null)
      return { ok: true }
    } catch (err) {
      console.error('login error', err)
      setError(err)
      return { ok: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  async function register(name, email, password) {
    setLoading(true)
    try {
      const { data } = await client.mutate({ mutation: REGISTER, variables: { input: { name, email, password } } })
      const { token: newToken, user: newUser } = data.register
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(newUser)
      setError(null)
      return { ok: true }
    } catch (err) {
      console.error('register error', err)
      setError(err)
      return { ok: false, error: err }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isAgent = user?.role === 'agent'

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isAgent,
    login,
    register,
    logout,
    loadMe,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
