import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AppContext = createContext()
const ALREADY_NOTIFIED = new Set()

export function AppProvider({ children }) {
    const [data, setData] = useState({
        contasPagar: [],
        contasReceber: [],
        clientes: [],
        faturamento: {
            'novo-horizonte': { nome: 'Unidade ST. Novo Horizonte', dados: {} },
            'coimbra': { nome: 'Unidade ST. Coimbra', dados: {} },
            'canaa': { nome: 'Unidade Canaã', dados: {} },
        }
    })

    const [loading, setLoading] = useState(true)

    // Carregar todos os dados do Supabase
    const loadData = async () => {
        try {
            setLoading(true)

            // Executa as 4 queries em paralelo para ser rápido
            const [rPagar, rReceber, rCadastros, rFaturamento] = await Promise.all([
                supabase.from('contas_pagar').select('*'),
                supabase.from('contas_receber').select('*'),
                supabase.from('cadastros').select('*'),
                supabase.from('faturamento').select('*')
            ])

            const error = rPagar.error || rReceber.error || rCadastros.error || rFaturamento.error
            if (error) {
                console.error('Erro ao carregar dados do Supabase:', error)
                // Usar dados vazios em caso de erro de conexão
                setLoading(false)
                return
            }

            // Moldar o faturamento para o formato esperado pelo frontend: faturamento[unidade].dados[ano][mes]
            const fatFormatado = {
                'novo-horizonte': { nome: 'Unidade ST. Novo Horizonte', dados: {} },
                'coimbra': { nome: 'Unidade ST. Coimbra', dados: {} },
                'canaa': { nome: 'Unidade Canaã', dados: {} },
            }

            if (rFaturamento.data) {
                rFaturamento.data.forEach(row => {
                    const { unidade, ano, mes, valor } = row
                    if (!fatFormatado[unidade]) return

                    if (!fatFormatado[unidade].dados[ano]) {
                        fatFormatado[unidade].dados[ano] = {}
                    }
                    fatFormatado[unidade].dados[ano][mes] = Number(valor)
                })
            }

            setData({
                contasPagar: rPagar.data || [],
                contasReceber: rReceber.data || [],
                clientes: rCadastros.data || [],
                faturamento: fatFormatado
            })
        } catch (err) {
            console.error('Exceção ao carregar:', err)
        } finally {
            setLoading(false)
        }
    }

    // Carrega na montagem
    useEffect(() => {
        loadData()
    }, [])

    // Notificações de Vencimento
    useEffect(() => {
        if (loading) return;

        const checkNotifications = (lista, tipoLabel, statusFechado) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            lista.forEach(c => {
                if (c.status === statusFechado) return;

                const dueDate = new Date(c.vencimento + 'T00:00:00');
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0 || diffDays > 3) return; // Só notificar de 0 a 3 dias

                const notifId = `${tipoLabel}_${c.id}_${diffDays}`;
                if (ALREADY_NOTIFIED.has(notifId)) return;

                if (diffDays === 0) {
                    toast(<span><b>{tipoLabel} Vence Hoje:</b><br />{c.descricao}</span>, { icon: '🚨', duration: 5000 });
                } else {
                    toast(<span><b>{tipoLabel} Vence em {diffDays} dia(s):</b><br />{c.descricao}</span>, { icon: '⚠️', duration: 5000 });
                }
                ALREADY_NOTIFIED.add(notifId);
            });
        };

        checkNotifications(data.contasPagar, 'Conta a Pagar', 'pago');
        checkNotifications(data.contasReceber, 'Conta a Receber', 'recebido');

    }, [data.contasPagar, data.contasReceber, loading]);

    // ==========================================
    // CRUD Contas a Pagar
    // ==========================================
    const addContaPagar = async (conta) => {
        // Optimistic UI - gera um ID temporário super alto p/ n dar conflito c/ o uuid do banco
        const tempId = `temp_${Date.now()}`
        const novaConta = { ...conta, id: tempId, created_at: new Date().toISOString() }
        setData(d => ({ ...d, contasPagar: [...d.contasPagar, novaConta] }))

        const { data: result, error } = await supabase.from('contas_pagar').insert(conta).select().single()
        if (!error && result) {
            setData(d => ({
                ...d, contasPagar: d.contasPagar.map(c => c.id === tempId ? result : c)
            }))
        } else {
            loadData() // rollback em falha
        }
    }

    const updateContaPagar = async (id, updates) => {
        setData(d => ({
            ...d, contasPagar: d.contasPagar.map(c => c.id === id ? { ...c, ...updates } : c)
        }))
        const { error } = await supabase.from('contas_pagar').update(updates).eq('id', id)
        if (error) loadData()
    }

    const deleteContaPagar = async (id) => {
        setData(d => ({ ...d, contasPagar: d.contasPagar.filter(c => c.id !== id) }))
        const { error } = await supabase.from('contas_pagar').delete().eq('id', id)
        if (error) loadData()
    }

    // ==========================================
    // CRUD Contas a Receber
    // ==========================================
    const addContaReceber = async (conta) => {
        const tempId = `temp_${Date.now()}`
        const novaConta = { ...conta, id: tempId, created_at: new Date().toISOString() }
        setData(d => ({ ...d, contasReceber: [...d.contasReceber, novaConta] }))

        const { data: result, error } = await supabase.from('contas_receber').insert(conta).select().single()
        if (!error && result) {
            setData(d => ({
                ...d, contasReceber: d.contasReceber.map(c => c.id === tempId ? result : c)
            }))
        } else {
            loadData()
        }
    }

    const updateContaReceber = async (id, updates) => {
        setData(d => ({
            ...d, contasReceber: d.contasReceber.map(c => c.id === id ? { ...c, ...updates } : c)
        }))
        const { error } = await supabase.from('contas_receber').update(updates).eq('id', id)
        if (error) loadData()
    }

    const deleteContaReceber = async (id) => {
        setData(d => ({ ...d, contasReceber: d.contasReceber.filter(c => c.id !== id) }))
        const { error } = await supabase.from('contas_receber').delete().eq('id', id)
        if (error) loadData()
    }

    // ==========================================
    // CRUD Cadastros (Clientes/Fornecedores)
    // ==========================================
    const addCadastro = async (cadastro) => {
        const tempId = `temp_${Date.now()}`
        const novoCad = { ...cadastro, id: tempId, created_at: new Date().toISOString() }
        setData(d => ({ ...d, clientes: [...d.clientes, novoCad] }))

        const { data: result, error } = await supabase.from('cadastros').insert(cadastro).select().single()
        if (!error && result) {
            setData(d => ({
                ...d, clientes: d.clientes.map(c => c.id === tempId ? result : c)
            }))
        } else {
            loadData()
        }
    }

    const updateCadastro = async (id, updates) => {
        setData(d => ({
            ...d, clientes: d.clientes.map(c => c.id === id ? { ...c, ...updates } : c)
        }))
        const { error } = await supabase.from('cadastros').update(updates).eq('id', id)
        if (error) loadData()
    }

    const deleteCadastro = async (id) => {
        setData(d => ({ ...d, clientes: d.clientes.filter(c => c.id !== id) }))
        const { error } = await supabase.from('cadastros').delete().eq('id', id)
        if (error) loadData()
    }

    // ==========================================
    // Faturamento
    // ==========================================
    const updateFaturamento = async (unidade, ano, mes, valor) => {
        // UI otimista
        setData(d => {
            const clone = JSON.parse(JSON.stringify(d))
            if (!clone.faturamento[unidade].dados[ano]) clone.faturamento[unidade].dados[ano] = {}
            clone.faturamento[unidade].dados[ano][mes] = Number(valor)
            return clone
        })

        // Upsert no supabase - usa o conflito por unidade, ano, mes p/ inserir ou atualizar
        const payload = { unidade, ano: Number(ano), mes, valor: Number(valor) }

        // Opcionalmente podemos tentar atualizar primeiro, e se falhar, inserir.
        // Ou delegar upsert para a restrição UNIQUE.
        const { data: existing } = await supabase.from('faturamento')
            .select('id')
            .eq('unidade', unidade)
            .eq('ano', Number(ano))
            .eq('mes', mes)
            .single()

        let err
        if (existing) {
            const { error } = await supabase.from('faturamento').update({ valor: Number(valor) }).eq('id', existing.id)
            err = error
        } else {
            const { error } = await supabase.from('faturamento').insert(payload)
            err = error
        }

        if (err) {
            console.error('Falha ao atualizar faturamento', err)
            loadData() // rollback
        }
    }

    // ==========================================
    // Computed values
    // ==========================================
    const totalPagar = data.contasPagar.filter(c => c.status !== 'pago').reduce((a, c) => a + Number(c.valor || 0), 0)
    const totalReceber = data.contasReceber.filter(c => c.status !== 'recebido').reduce((a, c) => a + Number(c.valor || 0), 0)

    const totalFaturamentoMes = Object.values(data.faturamento).reduce((total, un) => {
        const ano = new Date().getFullYear().toString()
        const meses = Object.values((un?.dados && un.dados[ano]) || {})
        return total + meses.reduce((a, v) => a + Number(v || 0), 0)
    }, 0)

    const saldo = totalReceber - totalPagar

    return (
        <AppContext.Provider value={{
            data, loading,
            addContaPagar, updateContaPagar, deleteContaPagar,
            addContaReceber, updateContaReceber, deleteContaReceber,
            addCadastro, updateCadastro, deleteCadastro,
            updateFaturamento,
            totalPagar, totalReceber, totalFaturamentoMes, saldo
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)
