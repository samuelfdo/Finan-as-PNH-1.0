import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, User, Building2, ChevronDown, Search } from 'lucide-react'
import Header from '../components/layout/Header'
import { maskCpfCnpj, maskPhone } from '../utils/masks'

const TIPOS = ['cliente', 'fornecedor']

function FormModal({ onClose, onSave, initial }) {
    const [form, setForm] = useState(initial || {
        nome: '', tipo: 'cliente', cpf_cnpj: '', telefone: '',
        email: '', status: 'ativo', observacoes: ''
    })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSave = () => {
        if (!form.nome) return
        onSave(form)
        onClose()
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-handle" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    {initial ? 'Editar Cadastro' : 'Novo Cadastro'}
                </h2>

                {/* Tipo toggle */}
                <div className="tab-bar" style={{ marginBottom: '16px' }}>
                    {TIPOS.map(t => (
                        <button key={t} className={`tab-item ${form.tipo === t ? 'active' : ''}`} onClick={() => set('tipo', t)} style={{ fontFamily: 'inherit' }}>
                            {t === 'cliente' ? '👤 Cliente' : '🏢 Fornecedor'}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Nome / Razão Social *</label>
                        <input className="input-field" placeholder="Nome completo ou razão social" value={form.nome} onChange={e => set('nome', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>CPF / CNPJ</label>
                            <input
                                className="input-field"
                                placeholder={form.tipo === 'cliente' ? "000.000.000-00" : "00.000.000/0000-00"}
                                value={form.cpf_cnpj || ''}
                                onChange={e => set('cpf_cnpj', maskCpfCnpj(e.target.value))}
                                maxLength={18}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Telefone</label>
                            <input
                                className="input-field"
                                placeholder="(38) 99999-0000"
                                value={form.telefone}
                                onChange={e => set('telefone', maskPhone(e.target.value))}
                                maxLength={15}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>E-mail</label>
                        <input className="input-field" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Status</label>
                        <div style={{ position: 'relative' }}>
                            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Observações</label>
                        <textarea
                            className="input-field"
                            placeholder="Observações relevantes..."
                            value={form.observacoes}
                            onChange={e => set('observacoes', e.target.value)}
                            rows={2}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <button className="btn-primary" style={{ marginTop: '8px' }} onClick={handleSave}>
                        {initial ? 'Salvar Alterações' : 'Adicionar Cadastro'}
                    </button>
                    <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    )
}

export default function Cadastros() {
    const { data, addCadastro, updateCadastro, deleteCadastro } = useApp()
    const [modal, setModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [activeTab, setActiveTab] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [search, setSearch] = useState('')

    const filtered = data.clientes.filter(c => {
        if (activeTab !== 'todos' && c.tipo !== activeTab) return false
        if (filterStatus !== 'todos' && c.status !== filterStatus) return false
        if (search && !c.nome.toLowerCase().includes(search.toLowerCase()) &&
            !c.cpfCnpj?.includes(search) && !c.email?.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const clCount = data.clientes.filter(c => c.tipo === 'cliente').length
    const fornCount = data.clientes.filter(c => c.tipo === 'fornecedor').length

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header title="Cadastros" subtitle={`${clCount} clientes • ${fornCount} fornecedores`} />

            <div className="page-content">
                {/* Tabs */}
                <div className="tab-bar" style={{ marginBottom: '12px' }}>
                    {[['todos', 'Todos'], ['cliente', '👤 Clientes'], ['fornecedor', '🏢 Fornecedores']].map(([v, l]) => (
                        <button key={v} className={`tab-item ${activeTab === v ? 'active' : ''}`} onClick={() => setActiveTab(v)} style={{ fontFamily: 'inherit', fontSize: '12px' }}>
                            {l}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="input-field"
                        placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '38px' }}
                    />
                </div>

                {/* Status filter */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {[['todos', 'Todos'], ['ativo', '✓ Ativos'], ['inativo', 'Inativos']].map(([v, l]) => (
                        <button key={v} className={`filter-chip ${filterStatus === v ? 'active' : ''}`} onClick={() => setFilterStatus(v)} style={{ fontFamily: 'inherit' }}>
                            {l}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    {[
                        { label: 'Total', value: data.clientes.length, color: 'var(--accent)' },
                        { label: 'Clientes', value: clCount, color: 'var(--success)' },
                        { label: 'Fornec.', value: fornCount, color: 'var(--warning)' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ padding: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* List */}
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                            <User size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                            <p style={{ fontSize: '14px' }}>Nenhum cadastro encontrado</p>
                        </div>
                    ) : filtered.map((item, i) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px',
                                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => { setEditItem(item); setModal(true) }}
                        >
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                                background: item.tipo === 'cliente' ? 'rgba(var(--accent-rgb), 0.14)' : 'rgba(var(--warning-rgb), 0.14)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {item.tipo === 'cliente'
                                    ? <User size={17} color="var(--accent)" />
                                    : <Building2 size={17} color="var(--warning)" />
                                }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.nome}
                                </p>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {item.telefone && `${item.telefone} • `}{item.email}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                                <span className={`badge ${item.status === 'ativo' ? 'badge-success' : 'badge-neutral'}`}>
                                    {item.status}
                                </span>
                                <button
                                    onClick={e => { e.stopPropagation(); deleteCadastro(item.id) }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ height: '16px' }} />
            </div>

            <button className="fab" onClick={() => { setEditItem(null); setModal(true) }}>
                <Plus size={22} strokeWidth={2.5} />
            </button>

            {modal && (
                <FormModal
                    onClose={() => { setModal(false); setEditItem(null) }}
                    onSave={editItem ? (d) => updateCadastro(editItem.id, d) : addCadastro}
                    initial={editItem}
                />
            )}
        </div>
    )
}
