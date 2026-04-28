import api from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authService = {
  login: (email, senha) =>
    api.post('/login', { email, senha }),
};

// ─── Alunos ──────────────────────────────────────────────────────────────────

export const alunosService = {
  listar: () =>
    api.get('/alunos'),

  buscarPorMatricula: (matricula) =>
    api.get(`/alunos/${matricula}`),

  criar: (dados) =>
    api.post('/alunos', dados),
};

// ─── Professores ─────────────────────────────────────────────────────────────

export const professoresService = {
  listar: () =>
    api.get('/professores'),

  criar: (dados) =>
    api.post('/professores', dados),
};

// ─── Disciplinas ─────────────────────────────────────────────────────────────

export const disciplinasService = {
  listar: () =>
    api.get('/disciplinas'),

  criar: (dados) =>
    api.post('/disciplinas', dados),
};

// ─── Notas ───────────────────────────────────────────────────────────────────

export const notasService = {
  criar: (dados) =>
    api.post('/notas', dados),

  atualizar: (id, dados) =>
    api.put(`/notas/${id}`, dados),
};

// ─── Boletim ─────────────────────────────────────────────────────────────────

export const boletimService = {
  consultar: (matricula) =>
    api.get(`/boletim/${matricula}`),
};

// ─── APIs Externas ───────────────────────────────────────────────────────────

export const viaCepService = {
  buscar: async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) throw new Error('CEP inválido');
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    if (data.erro) throw new Error('CEP não encontrado');
    return data;
  },
};

export const ibgeService = {
  listarEstados: async () => {
    const response = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
    );
    return response.json();
  },

  listarCidades: async (uf) => {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
    );
    return response.json();
  },
};
