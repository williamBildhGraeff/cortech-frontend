// utils/validators.js
export default {
  required: value =>
    !!value || 'Este campo é obrigatório',

  email: value =>
    !value ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    'E-mail inválido',
}