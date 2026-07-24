const onlyDigits = value => String(value || '').replace(/\D/g, '')

const isValidCPF = value => {
  const cpf = onlyDigits(value)

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false
  }

  let sum = 0
  for (let index = 0; index < 9; index += 1) {
    sum += Number(cpf[index]) * (10 - index)
  }

  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== Number(cpf[9])) {
    return false
  }

  sum = 0
  for (let index = 0; index < 10; index += 1) {
    sum += Number(cpf[index]) * (11 - index)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  return remainder === Number(cpf[10])
}

const isValidCNPJ = value => {
  const cnpj = onlyDigits(value)

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false
  }

  const digits = cnpj.split('').map(Number)

  const calculateCheckDigit = weights => {
    const sum = digits.slice(0, weights.length).reduce((total, digit, index) => total + digit * weights[index], 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const firstCheckDigit = calculateCheckDigit([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const secondCheckDigit = calculateCheckDigit([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return digits[12] === firstCheckDigit && digits[13] === secondCheckDigit
}

export default {
  required: value => {
    const normalizedValue = value == null ? '' : String(value).trim()
    return normalizedValue !== '' || 'Este campo é obrigatório'
  },

  nome: value => {
    const normalizedValue = String(value || '').trim()
    return normalizedValue.length >= 2 || 'Informe ao menos 2 caracteres'
  },

  email: value => {
    const normalizedValue = String(value || '').trim()

    if (!normalizedValue) {
      return true
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue) || 'E-mail inválido'
  },

  cpfCnpj: value => {
    const digits = onlyDigits(value)

    if (!digits) {
      return true
    }

    return (isValidCPF(value) || isValidCNPJ(value)) || 'CPF/CNPJ inválido'
  },

  telefone: value => {
    const digits = onlyDigits(value)

    if (!digits) {
      return true
    }

    return (digits.length >= 10 && digits.length <= 11) || 'Telefone inválido'
  },
}