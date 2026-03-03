import { useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableSelect({ options, value, onChange, placeholder = 'Selecione...', emptyText = 'Nenhum resultado' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')

    const selectedOption = options.find(o => o.value === value)

    const filteredOptions = options.filter(o => {
        if (!search) return true
        const s = search.toLowerCase()
        return (o.label || '').toLowerCase().includes(s) || (o.subLabel || '').toLowerCase().includes(s)
    })

    return (
        <div style={{ width: '100%' }}>
            <div
                className="input-field"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', userSelect: 'none', background: 'var(--card-bg)',
                    padding: '8px 12px', minHeight: '38px'
                }}
                onClick={() => setIsOpen(true)}
            >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {selectedOption && (
                        <button
                            type="button"
                            style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: 'var(--text-muted)' }}
                            onClick={(e) => { e.stopPropagation(); onChange(''); }}
                        >
                            <X size={14} />
                        </button>
                    )}
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
            </div>

            {isOpen && (
                <div className="modal-backdrop" style={{ zIndex: 100 }} onClick={() => setIsOpen(false)}>
                    <div className="modal-sheet" style={{ display: 'flex', flexDirection: 'column', maxHeight: '80svh', padding: '12px 20px 20px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-handle" />

                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                                {placeholder}
                            </h3>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Buscar nome ou CPF/CNPJ..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ paddingLeft: '36px' }}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, margin: '0 -20px', padding: '0 20px' }}>
                            {filteredOptions.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    {emptyText}
                                </div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.value}
                                        style={{
                                            padding: '12px 0',
                                            borderBottom: '1px solid var(--border)',
                                            cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', gap: '2px'
                                        }}
                                        onClick={() => {
                                            onChange(opt.value)
                                            setIsOpen(false)
                                            setSearch('')
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', fontWeight: opt.value === value ? '700' : '500', color: opt.value === value ? 'var(--accent)' : 'var(--text-primary)' }}>
                                            {opt.label}
                                        </span>
                                        {opt.subLabel && (
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                                {opt.subLabel}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <button className="btn-ghost" style={{ marginTop: '16px' }} onClick={() => setIsOpen(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
