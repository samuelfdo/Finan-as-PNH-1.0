import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Users, BarChart3 } from 'lucide-react'

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pagar', icon: ArrowDownCircle, label: 'A Pagar' },
    { path: '/receber', icon: ArrowUpCircle, label: 'A Receber' },
    { path: '/cadastros', icon: Users, label: 'Cadastros' },
    { path: '/faturamento', icon: BarChart3, label: 'Faturamento' },
]

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="bottom-nav">
            {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path
                return (
                    <button
                        key={path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => navigate(path)}
                        style={{ fontFamily: 'inherit' }}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                        <span>{label}</span>
                        <div className="nav-indicator" />
                    </button>
                )
            })}
        </nav>
    )
}
