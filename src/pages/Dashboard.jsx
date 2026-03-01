import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet, ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import Header from '../components/layout/Header'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

function MiniBar({ values, colors }) {
    const max = Math.max(...values, 1)
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px' }}>
            {values.map((v, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: `${Math.max((v / max) * 100, 8)}%`,
                    borderRadius: '4px 4px 0 0',
                    background: colors[i],
                    opacity: v === 0 ? 0.2 : 1,
                    transition: 'height 0.5s ease'
                }} />
            ))}
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub, color, colorRgb, onClick, accent = false }) {
    const alpha = (a) => colorRgb ? `rgba(${colorRgb}, ${a})` : `${color}${Math.round(a * 255).toString(16).padStart(2, '0')}`
    return (
        <button
            onClick={onClick}
            className={`card shimmer-card`}
            style={{
                padding: '14px',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontFamily: 'inherit',
                background: accent ? `linear-gradient(135deg, ${alpha(0.13)}, ${alpha(0.06)})` : 'var(--bg-card)',
                borderColor: accent ? alpha(0.25) : 'var(--border)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: alpha(0.13),
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Icon size={16} color={color} strokeWidth={2.5} />
                </div>
                <ChevronRight size={14} color="var(--text-muted)" />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                {label}
            </p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
                {value}
            </p>
            {sub && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>{sub}</p>}
        </button>
    )
}

export default function Dashboard() {
    const navigate = useNavigate()
    const { data, loading, totalPagar, totalReceber, saldo, totalFaturamentoMes } = useApp()

    if (loading && data.contasPagar.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Conectando com banco de dados...</p>
            </div>
        )
    }

    const vencidas = data.contasPagar.filter(c => c.status === 'vencido').length
    const pendentesRec = data.contasReceber.filter(c => c.status === 'pendente').length
    const atrasadas = data.contasReceber.filter(c => c.status === 'atrasado').length

    const unidades = Object.entries(data.faturamento)
    const fatValues = unidades.map(([, u]) => {
        return Object.values((u?.dados && u.dados['2026']) || {}).reduce((a, v) => a + Number(v), 0)
    })
    const unColors = ['#4A7FA5', '#4A9E6A', '#B08840']

    const recentTransactions = [
        ...data.contasPagar.slice(-2).map(c => ({ ...c, tipo: 'pagar' })),
        ...data.contasReceber.slice(-2).map(c => ({ ...c, tipo: 'receber' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

    const statusIcon = (s) => {
        if (s === 'pago' || s === 'recebido') return <CheckCircle size={14} color="var(--success)" />
        if (s === 'vencido' || s === 'atrasado') return <AlertCircle size={14} color="var(--danger)" />
        return <Clock size={14} color="var(--warning)" />
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header title="Financeiro PNH" subtitle="Visão geral do negócio" />

            <div className="page-content">
                {/* KPI Grid 2x2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <StatCard
                        icon={ArrowDownCircle}
                        label="A Pagar"
                        value={fmt(totalPagar)}
                        sub={vencidas > 0 ? `${vencidas} vencida${vencidas > 1 ? 's' : ''}` : 'Sem vencidas'}
                        color="#B05050"
                        colorRgb="176, 80, 80"
                        onClick={() => navigate('/pagar')}
                    />
                    <StatCard
                        icon={ArrowUpCircle}
                        label="A Receber"
                        value={fmt(totalReceber)}
                        sub={`${pendentesRec + atrasadas} pendente${pendentesRec + atrasadas !== 1 ? 's' : ''}`}
                        color="#4A9E6A"
                        colorRgb="74, 158, 106"
                        onClick={() => navigate('/receber')}
                    />
                    <StatCard
                        icon={Wallet}
                        label="Saldo"
                        value={fmt(saldo)}
                        sub={saldo >= 0 ? 'Positivo ✓' : 'Atenção!'}
                        color={saldo >= 0 ? '#3D9E65' : '#C04040'}
                        colorRgb={saldo >= 0 ? '61, 158, 101' : '192, 64, 64'}
                        accent
                        onClick={() => navigate('/receber')}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Faturamento"
                        value={fmt(totalFaturamentoMes)}
                        sub="2026 acumulado"
                        color="#B08840"
                        colorRgb="176, 136, 64"
                        onClick={() => navigate('/faturamento')}
                    />
                </div>

                {/* Faturamento por Unidade */}
                <button
                    className="card"
                    onClick={() => navigate('/faturamento')}
                    style={{ width: '100%', padding: '14px', marginBottom: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'var(--bg-card)', borderRadius: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Faturamento por Unidade</p>
                        <ChevronRight size={14} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '48px', marginBottom: '8px' }}>
                        {fatValues.map((v, i) => {
                            const max = Math.max(...fatValues, 1)
                            return (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${Math.max((v / max) * 84, 8)}%`,
                                        borderRadius: '6px 6px 0 0',
                                        background: unColors[i],
                                        opacity: v === 0 ? 0.25 : 0.85,
                                        transition: 'height 0.5s ease'
                                    }} />
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {unidades.map(([key, u], i) => (
                            <div key={key} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: unColors[i], flexShrink: 0 }} />
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {u.nome.replace('Unidade ST. ', '').replace('Unidade ', '')}
                                </span>
                            </div>
                        ))}
                    </div>
                </button>

                {/* Últimas Transações */}
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Últimas Transações</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => navigate('/pagar')} style={{ fontSize: '12px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Ver tudo
                            </button>
                        </div>
                    </div>
                    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                        {recentTransactions.map((t, i) => (
                            <div
                                key={t.id + t.tipo}
                                onClick={() => navigate(t.tipo === 'pagar' ? '/pagar' : '/receber')}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px',
                                    borderBottom: i < recentTransactions.length - 1 ? '1px solid var(--border)' : 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                                    background: t.tipo === 'pagar' ? 'rgba(var(--danger-rgb), 0.1)' : 'rgba(var(--success-rgb), 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {t.tipo === 'pagar'
                                        ? <ArrowDownCircle size={16} color="var(--danger)" />
                                        : <ArrowUpCircle size={16} color="var(--success)" />
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {t.descricao}
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                                        {t.tipo === 'pagar' ? (t.fornecedor || '') : (t.cliente || '')}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '13px', fontWeight: '600', color: t.tipo === 'pagar' ? 'var(--danger)' : 'var(--success)' }}>
                                        {t.tipo === 'pagar' ? '-' : '+'}{fmt(t.valor)}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                                        {statusIcon(t.status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertas rápidos */}
                {(vencidas > 0 || atrasadas > 0) && (
                    <div style={{
                        background: 'rgba(var(--danger-rgb), 0.08)',
                        border: '1px solid rgba(var(--danger-rgb), 0.2)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        marginBottom: '10px',
                        cursor: 'pointer'
                    }}
                        onClick={() => navigate(vencidas > 0 ? '/pagar' : '/receber')}
                    >
                        <AlertCircle size={18} color="var(--danger)" />
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--danger)' }}>Atenção necessária</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                                {vencidas > 0 && `${vencidas} conta${vencidas > 1 ? 's' : ''} vencida${vencidas > 1 ? 's' : ''} a pagar`}
                                {vencidas > 0 && atrasadas > 0 && ' • '}
                                {atrasadas > 0 && `${atrasadas} recebimento atrasado`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Cadastros rápido */}
                <button
                    className="card"
                    onClick={() => navigate('/cadastros')}
                    style={{
                        width: '100%', padding: '12px 14px', marginBottom: '12px', border: '1px solid var(--border)',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'var(--bg-card)',
                        borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Clientes e Fornecedores</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
                            {data.clientes.filter(c => c.tipo === 'cliente').length} clientes • {data.clientes.filter(c => c.tipo === 'fornecedor').length} fornecedores
                        </p>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                </button>
            </div>
        </div>
    )
}
