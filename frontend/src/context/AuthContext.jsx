import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'jobfinder_token'
const USER_KEY = 'jobfinder_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreUser = () => {
      const savedUser = localStorage.getItem(USER_KEY)
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          localStorage.removeItem(USER_KEY)
          setUser(null)
        }
      } else if (!token) {
        setUser(null)
      }
      setLoading(false)
    }
    restoreUser()
  }, [token])

  useEffect(() => {
    const handleLogout = () => {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const login = (userData, accessToken) => {
    setToken(accessToken)
    setUser(userData)
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
