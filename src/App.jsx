import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Clips from './pages/Clips'
import Proyectos from './pages/Proyectos'
import Cuentas from './pages/Cuentas'
import Analytics from './pages/Analytics'
import Subscriptions from './pages/Subscriptions'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clips" element={<Clips />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/cuentas" element={<Cuentas />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/planes" element={<Subscriptions />} />
        <Route path="/configuracion" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
