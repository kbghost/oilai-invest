import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Invest       from './pages/Invest'
import Deposits     from './pages/Deposits'
import Withdrawals  from './pages/Withdrawals'
import Transactions from './pages/Transactions'
import Profile      from './pages/Profile'
import Referral     from './pages/Referral'

// Admin pages
import AdminLayout      from './pages/admin/AdminLayout'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminUsers       from './pages/admin/AdminUsers'
import AdminDeposits    from './pages/admin/AdminDeposits'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

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
    </AuthProvider>
  )
}
