import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Lazy loaded Pages
const Landing      = lazy(() => import('./pages/Landing'))
const Login        = lazy(() => import('./pages/Login'))
const Register     = lazy(() => import('./pages/Register'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Invest       = lazy(() => import('./pages/Invest'))
const Deposits     = lazy(() => import('./pages/Deposits'))
const Withdrawals  = lazy(() => import('./pages/Withdrawals'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Profile      = lazy(() => import('./pages/Profile'))
const Referral     = lazy(() => import('./pages/Referral'))

// Lazy loaded Admin pages
const AdminLayout      = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers       = lazy(() => import('./pages/admin/AdminUsers'))
const AdminDeposits    = lazy(() => import('./pages/admin/AdminDeposits'))
const AdminWithdrawals = lazy(() => import('./pages/admin/AdminWithdrawals'))

// Layout
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'))

const Spinner = () => (
  <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{ width:32, height:32, border:'2.5px solid var(--border)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
  </div>
)

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Dashboard utilisateur */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index               element={<Dashboard />} />
            <Route path="invest"       element={<Invest />} />
            <Route path="deposits"     element={<Deposits />} />
            <Route path="withdrawals"  element={<Withdrawals />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile"      element={<Profile />} />
            <Route path="referral"     element={<Referral />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index              element={<AdminDashboard />} />
            <Route path="users"       element={<AdminUsers />} />
            <Route path="deposits"    element={<AdminDeposits />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
