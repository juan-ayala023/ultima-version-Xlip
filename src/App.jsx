import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Clips from './pages/Clips'
import Proyectos from './pages/Proyectos'
import Cuentas from './pages/Cuentas'
import Analytics from './pages/Analytics'
import Subscriptions from './pages/Subscriptions'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import { isAuthenticated, onAuthChange } from './api/client'

function ProtectedRoute({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated())
  const location = useLocation()

  useEffect(() => onAuthChange((tok) => setAuthed(Boolean(tok))), [])

  if (!authed) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/clips" element={<ProtectedRoute><Clips /></ProtectedRoute>} />
        <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
        <Route path="/cuentas" element={<ProtectedRoute><Cuentas /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/planes" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
