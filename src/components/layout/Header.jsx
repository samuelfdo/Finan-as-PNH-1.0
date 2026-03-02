import { Sun, Moon, Bell, Trash2, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useApp } from '../../context/AppContext'
import { useState, useRef, useEffect } from 'react'

export default function Header({ title, subtitle, rightAction }) {
    const { theme, toggleTheme } = useTheme()
    const { notifications, clearNotifications, removeNotification } = useApp()
    const [isBellOpen, setIsBellOpen] = useState(false)
    const bellRef = useRef(null)

    // Fechar popover ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsBellOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

                    <div ref={bellRef} style={{ position: 'relative' }}>
                        <button
                            className="notification-bell-btn"
                            onClick={() => setIsBellOpen(!isBellOpen)}
                        >
                            <Bell size={18} strokeWidth={2} />
                            {notifications.length > 0 && (
                                <div className="notification-badge">
                                    {notifications.length > 99 ? '99+' : notifications.length}
                                </div>
                            )}
                        </button>

                        {isBellOpen && (
                            <div className="notification-popover">
                                <div className="notification-popover-header">
                                    <h3>Notificações</h3>
                                    {notifications.length > 0 && (
                                        <button onClick={() => {
                                            clearNotifications()
                                            setIsBellOpen(false)
                                        }}>
                                            Limpar
                                        </button>
                                    )}
                                </div>
                                <div className="notification-popover-list">
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                            Nenhuma notificação por enquanto.
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="notification-item">
                                                <div className="notification-item-content">
                                                    <strong>{n.title}</strong>
                                                    <span>{n.description}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeNotification(n.id)}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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
