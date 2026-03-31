// Regras de validação reutilizáveis
export const validators = {
  required: (msg = 'Campo obrigatório.') => (value) => {
    if (!value || String(value).trim() === '') return msg;
    return null;
  },

  minLength: (min, msg) => (value) => {
    if (!value || value.trim().length < min) return msg || `Mínimo ${min} caracteres.`;
    return null;
  },

  email: (value) => {
    if (!value || value.trim() === '') return 'Informe o e-mail.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value.trim())) return 'Informe um e-mail válido.';
    return null;
  },

  select: (msg = 'Selecione uma opção.') => (value) => {
    if (!value || value === '') return msg;
    return null;
  },
};

// Formatadores
export const formatters = {
  cep: (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  },

  phone: (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return digits;
  },
};
