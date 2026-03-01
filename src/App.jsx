import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './pages/Dashboard'
import ContasPagar from './pages/ContasPagar'
import ContasReceber from './pages/ContasReceber'
import Cadastros from './pages/Cadastros'
import Faturamento from './pages/Faturamento'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pagar" element={<ContasPagar />} />
              <Route path="/receber" element={<ContasReceber />} />
              <Route path="/cadastros" element={<Cadastros />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
