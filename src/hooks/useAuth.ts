// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (data.success) {
        setAuth({ user: data.user, loading: false, error: null })
      } else {
        setAuth({ user: null, loading: false, error: data.error })
        router.push('/auth/login')
      }
    } catch (error) {
      setAuth({ user: null, loading: false, error: 'Failed to check auth status' })
      router.push('/auth/login')
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.success) {
        setAuth({ user: data.user, loading: false, error: null })
        return true
      } else {
        setAuth(prev => ({ ...prev, error: data.error }))
        return false
      }
    } catch (error) {
      setAuth(prev => ({ ...prev, error: 'Failed to login' }))
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuth({ user: null, loading: false, error: null })
      router.push('/auth/login')
    } catch (error) {
      setAuth(prev => ({ ...prev, error: 'Failed to logout' }))
    }
  }

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login,
    logout,
    checkAuth
  }
}
