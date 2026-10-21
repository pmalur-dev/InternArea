
import { useCallback, useEffect, useState } from 'react'
import * as authService from '../services/authService'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const result = await authService.getCurrentUser()
      setUser(result.user || result)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  async function signIn(credentials) {
    await authService.login(credentials)
    await refreshUser()
  }

  async function signUp(details) {
    await authService.register(details)
    await signIn({
      email: details.email,
      password: details.password,
    })
  }

  async function signOut() {
    await authService.logout()
    setUser(null)
  }

  return { user, loading, signIn, signUp, signOut, refreshUser }
}