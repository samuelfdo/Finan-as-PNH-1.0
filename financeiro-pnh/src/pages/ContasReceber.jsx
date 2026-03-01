import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, AlertCircle, CheckCircle, Clock, ChevronDown } from 'lucide-react'
import Header from '../components/layout/Header'
import { maskCurrency, parseCurrency } from '../utils/masks'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
const STATUS_OPTS = ['pendente', 'recebido', 'atrasado']

const statusConfig = {
    recebido: { label: 'Recebido', className: 'badge-success', icon: CheckCircle, color: 'var(--success)' },
    pendente: { label: 'Pendente', className: 'badge-warning', icon: Clock, color: 'var(--warning)' },
    atrasado: { label: 'Atrasado', className: 'badge-danger', icon: AlertCircle, color: 'var(--danger)' },
}

function FormModal({ onClose, onSave, initial }) {
    const [form, setForm] = useState(initial || {
        descricao: '', valor: '', vencimento: '', cliente: '', status: 'pendente'
    })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSave = () => {
        if (!form.descricao || !form.valor || !form.vencimento) return
        onSave({ ...form, valor: parseCurrency(form.valor) })
        onClose()
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
                    {initial ? 'Editar Lançamento' : 'Novo Lançamento a Receber'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Descrição *</label>
                        <input className="input-field" placeholder="Ex: Venda atacado escola" value={form.descricao} onChange={e => set('descricao', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Valor (R$) *</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="0,00"
                                value={form.valor}
                                onChange={e => set('valor', maskCurrency(e.target.value))}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Vencimento *</label>
                            <input className="input-field" type="date" value={form.vencimento} onChange={e => set('vencimento', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Cliente</label>
                        <input className="input-field" placeholder="Nome do cliente" value={form.cliente} onChange={e => set('cliente', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Status</label>
                        <div style={{ position: 'relative' }}>
                            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
                                {STATUS_OPTS.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: '8px' }} onClick={handleSave}>
                        {initial ? 'Salvar Alterações' : 'Adicionar Lançamento'}
                    </button>
                    <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default function ContasReceber() {
    const { data, addContaReceber, updateContaReceber, deleteContaReceber } = useApp()
    const [modal, setModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [filterStatus, setFilterStatus] = useState('todos')
    const [search, setSearch] = useState('')

    const filtered = data.contasReceber.filter(c => {
        if (filterStatus !== 'todos' && c.status !== filterStatus) return false
        if (search && !c.descricao.toLowerCase().includes(search.toLowerCase()) && !c.cliente?.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))

    const total = filtered.reduce((a, c) => a + c.valor, 0)
    const totalPendente = filtered.filter(c => c.status !== 'recebido').reduce((a, c) => a + c.valor, 0)

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header title="Contas a Receber" subtitle={`${filtered.length} lançamento${filtered.length !== 1 ? 's' : ''}`} />

            <div className="page-content">
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div className="card" style={{ padding: '12px' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>{fmt(total)}</p>
                    </div>
                    <div className="card" style={{ padding: '12px', background: 'rgba(var(--success-rgb), 0.08)', borderColor: 'rgba(var(--success-rgb), 0.2)' }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pendente</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--success)', marginTop: '2px' }}>{fmt(totalPendente)}</p>
                    </div>
                </div>

                {/* Search */}
                <input
                    className="input-field"
                    placeholder="🔍  Buscar lançamento ou cliente..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '4px' }}>
                    {['todos', ...STATUS_OPTS].map(s => (
                        <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)} style={{ fontFamily: 'inherit' }}>
                            {s === 'todos' ? 'Todos' : statusConfig[s]?.label || s}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                            <CheckCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                            <p style={{ fontSize: '14px' }}>Nenhum lançamento encontrado</p>
                        </div>
                    ) : filtered.map((conta, i) => {
                        const cfg = statusConfig[conta.status]
                        const Icon = cfg.icon
                        return (
                            <div
                                key={conta.id}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px',
                                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => { setEditItem(conta); setModal(true) }}
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                    background: `${cfg.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon size={16} color={cfg.color} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conta.descricao}
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        {conta.cliente && `${conta.cliente} • `}{new Date(conta.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '700', color: conta.status === 'recebido' ? 'var(--text-muted)' : 'var(--success)' }}>
                                        {fmt(conta.valor)}
                                    </p>
                                    <span className={`badge ${cfg.className}`} style={{ fontSize: '10px' }}>{cfg.label}</span>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); deleteContaReceber(conta.id) }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0 }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )
                    })}
                </div>
                <div style={{ height: '16px' }} />
            </div>

            <button className="fab" onClick={() => { setEditItem(null); setModal(true) }}>
                <Plus size={22} strokeWidth={2.5} />
            </button>

            {modal && (
                <FormModal
                    onClose={() => { setModal(false); setEditItem(null) }}
                    onSave={editItem ? (d) => updateContaReceber(editItem.id, d) : addContaReceber}
                    initial={editItem ? { ...editItem, valor: maskCurrency(Math.round(editItem.valor * 100)) } : null}
                />
            )}
        </div>
    )
}
