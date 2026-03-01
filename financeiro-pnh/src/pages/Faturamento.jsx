import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ChevronDown, Plus, TrendingUp, TrendingDown, Minus, X, Check } from 'lucide-react'
import Header from '../components/layout/Header'
import { maskCurrency, parseCurrency } from '../utils/masks'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
const fmtFull = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const ANOS = ['2026', '2025', '2024']

const UNIDADES = [
    { key: 'novo-horizonte', label: 'Novo Horizonte', short: 'NH', color: '#4A7FA5', bg: 'rgba(74,127,165,0.12)' },
    { key: 'coimbra', label: 'Coimbra', short: 'CO', color: '#4A9E6A', bg: 'rgba(74,158,106,0.12)' },
    { key: 'canaa', label: 'Canaã', short: 'CA', color: '#B5893A', bg: 'rgba(181,137,58,0.12)' },
]

// Modal para editar um mês de uma unidade específica
function EditModal({ unidade, mes, ano, valorAtual, onClose, onSave }) {
    // Inicializa o valor com a máscara corretamente se já houver ganho preenchido no BD
    const [val, setVal] = useState(valorAtual > 0 ? maskCurrency(Math.round(valorAtual * 100)) : '')

    const handleSave = () => {
        const num = parseCurrency(val)
        onSave(num)
        onClose()
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ paddingBottom: 'calc(20px + var(--safe-area-bottom))' }}>
                <div className="modal-handle" />

                {/* Unidade header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'
                }}>
                    <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: unidade.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '15px', fontWeight: '800', color: unidade.color
                    }}>
                        {unidade.short}
                    </div>
                    <div>
                        <p style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {unidade.label}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '1px' }}>
                            Faturamento de {mes} / {ano}
                        </p>
                    </div>
                </div>

                {/* Input principal */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Valor do Faturamento
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                            fontSize: '18px', fontWeight: '600', color: unidade.color
                        }}>R$</span>
                        <input
                            autoFocus
                            className="input-field"
                            type="text"
                            placeholder="0,00"
                            value={val}
                            onChange={e => setVal(maskCurrency(e.target.value))}
                            onKeyDown={e => e.key === 'Enter' && handleSave()}
                            style={{
                                paddingLeft: '52px', fontSize: '24px', fontWeight: '700',
                                height: '64px', borderColor: val > 0 ? unidade.color : 'var(--border)',
                                color: 'var(--text-primary)', letterSpacing: '-0.02em'
                            }}
                        />
                    </div>
                    {valorAtual > 0 && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            Valor atual: {fmtFull(valorAtual)}
                        </p>
                    )}
                </div>

                {/* Atalhos rápidos */}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Valores rápidos</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[10000, 15000, 20000, 25000, 30000, 35000].map(v => {
                        const maskedVal = maskCurrency(v * 100) // v = 10000, v*100 = 1000000 -> 10.000,00
                        return (
                            <button
                                key={v}
                                onClick={() => setVal(maskedVal)}
                                style={{
                                    padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${parseCurrency(val) === v ? unidade.color : 'var(--border)'}`,
                                    background: parseCurrency(val) === v ? `${unidade.color}20` : 'transparent',
                                    color: parseCurrency(val) === v ? unidade.color : 'var(--text-secondary)',
                                    fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {fmt(v)}
                            </button>
                        )
                    })}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        style={{ background: unidade.color, flex: 1 }}
                    >
                        <Check size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                        Salvar
                    </button>
                    {valorAtual > 0 && (
                        <button
                            onClick={() => { onSave(0); onClose() }}
                            style={{
                                padding: '14px', borderRadius: '14px', background: 'rgba(var(--danger-rgb), 0.1)',
                                border: '1.5px solid rgba(var(--danger-rgb), 0.2)', color: 'var(--danger)', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Zerar valor"
                        >
                            <X size={18} />
                        </button>
                    )}
                    <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

// Card individual de um mês
function MesCard({ mes, valor, color, bg, onClick, isFuture }) {
    const hasValue = valor > 0

    return (
        <button
            onClick={onClick}
            style={{
                background: hasValue ? bg : 'var(--bg-card)',
                border: `1.5px solid ${hasValue ? color + '55' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '16px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: isFuture && !hasValue ? 0.4 : 1,
                fontFamily: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                minHeight: '80px',
                justifyContent: 'center'
            }}
        >
            {hasValue && (
                <div style={{
                    position: 'absolute', top: '7px', right: '7px',
                    width: '7px', height: '7px', borderRadius: '50%', background: color
                }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: '700', color: hasValue ? color : 'var(--text-muted)', letterSpacing: '0.02em' }}>
                {mes}
            </span>
            {hasValue ? (
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2, textAlign: 'center' }}>
                    {fmt(valor)}
                </span>
            ) : (
                <Plus size={16} color="var(--text-muted)" strokeWidth={2} />
            )}
        </button>
    )
}

// Seção de uma unidade
function UnidadeSection({ unidade, anoData, ano, onEdit }) {
    const [collapsed, setCollapsed] = useState(false)

    const total = Object.values(anoData).reduce((a, v) => a + v, 0)
    const mesesComDados = Object.values(anoData).filter(v => v > 0).length
    const media = mesesComDados > 0 ? total / mesesComDados : 0
    const mesAtualIdx = new Date().getMonth()
    const mesAnteriorVal = mesAtualIdx > 0 ? anoData[MESES[mesAtualIdx - 1]] || 0 : 0
    const mesAtualVal = anoData[MESES[mesAtualIdx]] || 0
    const variacao = mesAnteriorVal > 0 ? ((mesAtualVal - mesAnteriorVal) / mesAnteriorVal) * 100 : null

    const maxValor = Math.max(...Object.values(anoData), 1)

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: `1.5px solid ${unidade.color}25`,
            borderRadius: '18px',
            overflow: 'hidden',
            marginBottom: '12px'
        }}>
            {/* Header da Unidade */}
            <button
                onClick={() => setCollapsed(c => !c)}
                style={{
                    width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center',
                    gap: '12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                }}
            >
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                    background: unidade.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: '800', color: unidade.color,
                    letterSpacing: '-0.02em'
                }}>
                    {unidade.short}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {unidade.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: unidade.color }}>
                            {fmt(total)}
                        </span>
                        {variacao !== null && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '2px',
                                padding: '1px 6px', borderRadius: '10px',
                                background: variacao >= 0 ? 'rgba(var(--success-rgb), 0.12)' : 'rgba(var(--danger-rgb), 0.12)'
                            }}>
                                {variacao > 0 ? <TrendingUp size={10} color="var(--success)" /> : variacao < 0 ? <TrendingDown size={10} color="var(--danger)" /> : <Minus size={10} color="var(--text-muted)" />}
                                <span style={{ fontSize: '10px', fontWeight: '600', color: variacao >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                    {Math.abs(variacao).toFixed(1)}%
                                </span>
                            </div>
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {mesesComDados}/{MESES.length} meses
                        </span>
                    </div>
                </div>

                {/* Mini progress bar */}
                <div style={{ width: '48px', textAlign: 'right' }}>
                    <div style={{ height: '3px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{
                            height: '100%', width: `${(mesesComDados / 12) * 100}%`,
                            background: unidade.color, borderRadius: '10px'
                        }} />
                    </div>
                    <ChevronDown size={16} color="var(--text-muted)" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: '0.2s' }} />
                </div>
            </button>

            {/* Body — Cards dos meses */}
            {!collapsed && (
                <div style={{ padding: '0 12px 14px' }}>
                    {/* Divider com média */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 4px', marginBottom: '10px',
                        borderTop: '1px solid var(--border)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Média mensal: <strong style={{ color: 'var(--text-secondary)' }}>{media > 0 ? fmt(media) : '—'}</strong>
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Toque para editar
                        </span>
                    </div>

                    {/* Grid de meses — 4 colunas x 3 linhas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {MESES.map((mes, idx) => {
                            const isFuture = ano === '2026' && idx > new Date().getMonth()
                            return (
                                <MesCard
                                    key={mes}
                                    mes={mes}
                                    valor={anoData[mes] || 0}
                                    color={unidade.color}
                                    bg={unidade.bg}
                                    isFuture={isFuture}
                                    onClick={() => onEdit(unidade, mes)}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Faturamento() {
    const { data, updateFaturamento } = useApp()
    const [activeAno, setActiveAno] = useState('2026')
    const [editTarget, setEditTarget] = useState(null) // { unidade, mes }

    const handleEdit = (unidade, mes) => {
        setEditTarget({ unidade, mes })
    }

    const handleSave = (valor) => {
        updateFaturamento(editTarget.unidade.key, activeAno, editTarget.mes, valor)
    }

    // Total geral do ano
    const totalGeral = UNIDADES.reduce((total, u) => {
        const d = data.faturamento[u.key]?.dados[activeAno] || {}
        return total + Object.values(d).reduce((a, v) => a + v, 0)
    }, 0)

    // Stats por unidade para comparativo rápido
    const comparativo = UNIDADES.map(u => {
        const d = data.faturamento[u.key]?.dados[activeAno] || {}
        return { ...u, total: Object.values(d).reduce((a, v) => a + v, 0) }
    })
    const maxCompar = Math.max(...comparativo.map(c => c.total), 1)

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header
                title="Faturamento"
                subtitle="Papelaria PNH"
                rightAction={
                    <div style={{ position: 'relative' }}>
                        <select
                            className="input-field"
                            value={activeAno}
                            onChange={e => setActiveAno(e.target.value)}
                            style={{ padding: '7px 28px 7px 12px', fontSize: '13px', fontWeight: '600', width: 'auto', height: '36px' }}
                        >
                            {ANOS.map(a => <option key={a}>{a}</option>)}
                        </select>
                        <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>
                }
            />

            <div className="page-content">

                {/* Total Geral + Comparativo rápido */}
                <div className="card" style={{ padding: '16px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Acumulado {activeAno}
                            </p>
                            <p style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', letterSpacing: '-0.03em' }}>
                                {fmt(totalGeral)}
                            </p>
                        </div>
                        <div style={{
                            padding: '8px 12px', background: 'rgba(var(--accent-rgb), 0.1)',
                            borderRadius: '12px', border: '1px solid rgba(var(--accent-rgb), 0.2)'
                        }}>
                            <p style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>3 Unidades</p>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {fmt(totalGeral / 3)}
                            </p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>média/unid.</p>
                        </div>
                    </div>

                    {/* Barras comparativas */}
                    {comparativo.map(u => (
                        <div key={u.key} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: u.color }} />
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{u.label}</span>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: u.color }}>{fmt(u.total)}</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${(u.total / maxCompar) * 100}%`,
                                    background: u.color, borderRadius: '10px',
                                    opacity: u.total === 0 ? 0.15 : 0.85,
                                    transition: 'width 0.6s ease'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Unidades */}
                {UNIDADES.map(unidade => {
                    const anoData = data.faturamento[unidade.key]?.dados[activeAno] || {}
                    return (
                        <UnidadeSection
                            key={unidade.key}
                            unidade={unidade}
                            anoData={anoData}
                            ano={activeAno}
                            onEdit={handleEdit}
                        />
                    )
                })}

                <div style={{ height: '16px' }} />
            </div>

            {/* Modal de edição */}
            {editTarget && (
                <EditModal
                    unidade={editTarget.unidade}
                    mes={editTarget.mes}
                    ano={activeAno}
                    valorAtual={data.faturamento[editTarget.unidade.key]?.dados[activeAno]?.[editTarget.mes] || 0}
                    onClose={() => setEditTarget(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}
