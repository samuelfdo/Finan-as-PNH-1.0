// Máscara para CPF ou CNPJ
export const maskCpfCnpj = (value) => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')

    if (v.length <= 11) { // CPF
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else { // CNPJ
        v = v.substring(0, 14) // Limite de 14 dígitos
        v = v.replace(/^(\d{2})(\d)/, '$1.$2')
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
        v = v.replace(/(\d{4})(\d)/, '$1-$2')
    }
    return v
}

// Máscara para Telefone (Fixo ou Celular)
export const maskPhone = (value) => {
    if (!value) return ''
    let v = value.replace(/\D/g, '')
    v = v.substring(0, 11) // Limite de 11 dígitos

    if (v.length > 10) { // Celular: (XX) XXXXX-XXXX
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
        v = v.replace(/(\d{5})(\d)/, '$1-$2')
    } else { // Fixo: (XX) XXXX-XXXX
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
        v = v.replace(/(\d{4})(\d)/, '$1-$2')
    }
    return v
}

// Máscara para Dinheiro / Moeda (BRL)
// Exemplo: 1000 => 1.000,00
export const maskCurrency = (value) => {
    if (value === undefined || value === null || value === '') return ''

    // Remove tudo que não é dígito
    let v = value.toString().replace(/\D/g, '')

    // Se for string vazia após limpar, retorna string vazia
    if (v === '') return ''

    // Converte para número e divide por 100 para pegar os centavos decimais corretos
    // Isso é ideal para inputs onde o usuário vai digitando ex: 1 -> 0,01 -> 1,00 -> 10,00 -> 100,00
    const numberValue = Number(v) / 100

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue)
}

// Converte string de moeda padronizada BR formatada ("1.000,00") para NumberJS float (1000.00) q vai pro BD
export const parseCurrency = (value) => {
    if (!value) return 0
    let v = value.toString().replace(/\./g, '').replace(',', '.')
    return parseFloat(v) || 0
}
