import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export default function SearchableSelect({ options, value, onChange, placeholder = 'Selecione...', emptyText = 'Nenhum resultado' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef(null)

    const selectedOption = options.find(o => o.value === value)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(o => {
        if (!search) return true
        const s = search.toLowerCase()
        return (o.label || '').toLowerCase().includes(s) || (o.subLabel || '').toLowerCase().includes(s)
    })

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div
                className="input-field"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', userSelect: 'none', background: 'var(--card-bg)',
                    padding: '8px 12px', minHeight: '38px'
                }}
                onClick={() => setIsOpen(!isOpen)}
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
                    <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                    marginTop: '4px', background: 'var(--card-bg)', border: '1px solid var(--border)',
                    borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', maxHeight: '250px'
                }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <input
                            type="text"
                            placeholder="Buscar nome ou CPF/CNPJ..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                border: 'none', background: 'transparent', width: '100%',
                                color: 'var(--text-primary)', fontSize: '13px', outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredOptions.length === 0 ? (
                            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                                {emptyText}
                            </div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    style={{
                                        padding: '10px 12px',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        background: opt.value === value ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                                        display: 'flex', flexDirection: 'column', gap: '2px'
                                    }}
                                    onClick={() => {
                                        onChange(opt.value)
                                        setIsOpen(false)
                                        setSearch('')
                                    }}
                                >
                                    <span style={{ fontSize: '13px', fontWeight: opt.value === value ? '600' : '500', color: 'var(--text-primary)' }}>
                                        {opt.label}
                                    </span>
                                    {opt.subLabel && (
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                            {opt.subLabel}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
