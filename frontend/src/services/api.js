import axios from 'axios'

// ─── URL de l'API backend ─────────────────────────────────────────────────────
// Dev local : proxy Vite → '/api' redirige vers localhost:5000/api
// Production: mettre VITE_API_URL=https://votre-api.onrender.com/api dans Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

// ─── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me')
}

// ─── Investments ──────────────────────────────────────────────────────────────
export const investmentAPI = {
  getPlans:   ()     => api.get('/investments/plans'),
  create:     (data) => api.post('/investments', data),
  getAll:     ()     => api.get('/investments'),
  getById:    (id)   => api.get(`/investments/${id}`),
  processProfits: () => api.post('/investments/process-profits'),
  claim:  (id)   => api.post(`/investments/${id}/claim`),
}

// ─── Deposits ─────────────────────────────────────────────────────────────────
export const depositAPI = {
  create:  (formData) => api.post('/deposits', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll:  ()         => api.get('/deposits'),
  // Admin
  adminGetAll: (params) => api.get('/deposits/all', { params }),
  approve: (id, data)   => api.patch(`/deposits/${id}/approve`, data),
  reject:  (id, data)   => api.patch(`/deposits/${id}/reject`, data)
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────
export const withdrawalAPI = {
  create:  (data) => api.post('/withdrawals', data),
  getAll:  ()     => api.get('/withdrawals'),
  // Admin
  adminGetAll: (params) => api.get('/withdrawals/all', { params }),
  approve: (id, data)   => api.patch(`/withdrawals/${id}/approve`, data),
  reject:  (id, data)   => api.patch(`/withdrawals/${id}/reject`, data)
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:       ()           => api.get('/admin/stats'),
  getUsers:       (params)     => api.get('/admin/users', { params }),
  toggleStatus:   (id)         => api.patch(`/admin/users/${id}/toggle`),
  adjustBalance:  (id, data)   => api.patch(`/admin/users/${id}/balance`, data)
}

// ─── Oil ──────────────────────────────────────────────────────────────────────
export const oilAPI = {
  getPrice: () => api.get('/oil/price'),
  getNews:  () => api.get('/oil/news')
}

export default api

// ─── Parrainage ───────────────────────────────────────────────────────────────
export const referralAPI = {
  getStats:   ()     => api.get('/users/referral'),
  verifyCode: (code) => api.get(`/auth/referral/verify/${code}`),
}
