/**
 * AuthContext.jsx
 *
 * Gère l'état d'authentification de l'application.
 *
 * IMPORTANT : le user stocké en localStorage doit contenir referralCode
 * pour que la page Parrainage (/dashboard/referral) fonctionne sans appel API supplémentaire.
 * C'est garanti par la fonction safeUser() dans authController.js côté backend.
 *
 * RESTAURATION DE SESSION :
 *   Au chargement de l'app, on vérifie si un token et un user sont en localStorage.
 *   Si oui → on restaure la session sans redemander au serveur.
 *   L'endpoint /api/auth/me est appelé pour mettre à jour les données fraîches.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Restaurer la session au montage ───────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('token')
      const saved = localStorage.getItem('user')

      if (!token) {
        setLoading(false)
        return
      }

      // Restaurer depuis localStorage immédiatement (évite le flash de déconnexion)
      if (saved) {
        try { setUser(JSON.parse(saved)) } catch {}
      }

      // Rafraîchir depuis l'API pour avoir des données à jour (solde, etc.)
      try {
        const { data } = await authAPI.getMe()
        if (data.success) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch {
        // Token expiré ou invalide → déconnecter
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      }

      setLoading(false)
    }

    restore()
  }, [])

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  // ── REGISTER ─────────────────────────────────────────────────────────────
  // formData peut contenir : firstName, lastName, email, password, phone, country, referralCode
  const register = async (formData) => {
    const { data } = await authAPI.register(formData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // ── UPDATE USER (solde, profil, etc.) ────────────────────────────────────
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser }
    setUser(merged)
    localStorage.setItem('user', JSON.stringify(merged))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
