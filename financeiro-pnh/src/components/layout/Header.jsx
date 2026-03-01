import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function Header({ title, subtitle, rightAction }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="page-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {rightAction}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '36px', height: '36px',
                            borderRadius: '10px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {theme === 'dark'
                            ? <Sun size={16} strokeWidth={2} />
                            : <Moon size={16} strokeWidth={2} />
                        }
                    </button>
                </div>
            </div>
        </header>
    )
}
