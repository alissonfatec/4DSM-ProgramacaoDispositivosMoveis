import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// Mock initial data
const INITIAL_ALUNOS = [
  {
    id: '1', nome: 'Ana Paula Silva', matricula: 'FA2024001', curso: 'DSM',
    email: 'ana@fatec.sp.gov.br', telefone: '(12) 99111-2222',
    cep: '12300-000', endereco: 'Av. das Flores, 100', cidade: 'Jacareí', estado: 'SP',
  },
  {
    id: '2', nome: 'Bruno Carvalho', matricula: 'FA2024002', curso: 'DSM',
    email: 'bruno@fatec.sp.gov.br', telefone: '(12) 99333-4444',
    cep: '12310-000', endereco: 'Rua das Pedras, 55', cidade: 'São José dos Campos', estado: 'SP',
  },
  {
    id: '3', nome: 'Carla Dias', matricula: 'FA2024003', curso: 'ADS',
    email: 'carla@fatec.sp.gov.br', telefone: '(12) 99555-6666',
    cep: '12320-000', endereco: 'Rua Ipiranga, 200', cidade: 'Jacareí', estado: 'SP',
  },
];

const INITIAL_PROFESSORES = [
  {
    id: '1', nome: 'Prof. Dr. André Olímpio', titulacao: 'Doutor (PhD)',
    area: 'Sistemas Móveis, UX', tempo: '9 a 15 anos', email: 'andre@fatec.sp.gov.br',
  },
  {
    id: '2', nome: 'Prof. MSc. Maria Fernanda', titulacao: 'Mestre (MSc)',
    area: 'Banco de Dados, Backend', tempo: '4 a 8 anos', email: 'maria@fatec.sp.gov.br',
  },
];

const INITIAL_DISCIPLINAS = [
  { id: '1', nome: 'Prog. Dispositivos Móveis I', cargaHoraria: '80', professor: 'Prof. Dr. André Olímpio', curso: 'DSM', semestre: '4º' },
  { id: '2', nome: 'Banco de Dados Relacional', cargaHoraria: '80', professor: 'Prof. MSc. Maria Fernanda', curso: 'DSM', semestre: '3º' },
  { id: '3', nome: 'Engenharia de Software', cargaHoraria: '60', professor: 'Prof. Dr. André Olímpio', curso: 'DSM', semestre: '4º' },
  { id: '4', nome: 'Matemática Discreta', cargaHoraria: '60', professor: 'Prof. MSc. Maria Fernanda', curso: 'ADS', semestre: '2º' },
  { id: '5', nome: 'Redes de Computadores', cargaHoraria: '60', professor: 'Prof. Dr. André Olímpio', curso: 'GTI', semestre: '3º' },
];

const BOLETINS = {
  '1': [
    { disciplina: 'Prog. Dispositivos Móveis I', nota1: 8.0, nota2: 7.5 },
    { disciplina: 'Banco de Dados Relacional', nota1: 9.0, nota2: 8.5 },
    { disciplina: 'Engenharia de Software', nota1: 6.5, nota2: 5.0 },
    { disciplina: 'Matemática Discreta', nota1: 7.0, nota2: 8.0 },
    { disciplina: 'Redes de Computadores', nota1: 5.0, nota2: 4.5 },
  ],
  '2': [
    { disciplina: 'Prog. Dispositivos Móveis I', nota1: 9.5, nota2: 9.0 },
    { disciplina: 'Banco de Dados Relacional', nota1: 8.0, nota2: 7.0 },
    { disciplina: 'Engenharia de Software', nota1: 7.5, nota2: 8.0 },
    { disciplina: 'Matemática Discreta', nota1: 6.0, nota2: 6.5 },
    { disciplina: 'Redes de Computadores', nota1: 8.5, nota2: 9.0 },
  ],
  '3': [
    { disciplina: 'Prog. Dispositivos Móveis I', nota1: 5.5, nota2: 6.0 },
    { disciplina: 'Banco de Dados Relacional', nota1: 7.0, nota2: 6.5 },
    { disciplina: 'Engenharia de Software', nota1: 4.0, nota2: 3.5 },
    { disciplina: 'Matemática Discreta', nota1: 8.0, nota2: 7.0 },
    { disciplina: 'Redes de Computadores', nota1: 6.5, nota2: 7.0 },
  ],
};

export function AppProvider({ children }) {
  // useState — estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // useState — dados da aplicação
  const [alunos, setAlunos] = useState(INITIAL_ALUNOS);
  const [professores, setProfessores] = useState(INITIAL_PROFESSORES);
  const [disciplinas, setDisciplinas] = useState(INITIAL_DISCIPLINAS);
  const [boletins] = useState(BOLETINS);

  // useEffect — inicialização (simula carregamento de dados)
  useEffect(() => {
    console.log('[AppContext] Contexto inicializado. Dados mockados carregados.');
    console.log(`[AppContext] Alunos: ${INITIAL_ALUNOS.length} | Professores: ${INITIAL_PROFESSORES.length} | Disciplinas: ${INITIAL_DISCIPLINAS.length}`);
  }, []);

  function login(username, password) {
    if (
      (username === 'admin' || username === 'admin@fatec.sp.gov.br') &&
      password === '1234'
    ) {
      setIsAuthenticated(true);
      setLoggedUser({ nome: 'Administrador', username });
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    setLoggedUser(null);
  }

  function adicionarAluno(aluno) {
    const novoAluno = { ...aluno, id: String(Date.now()) };
    setAlunos(prev => [...prev, novoAluno]);
    console.log('[AppContext] Aluno adicionado:', novoAluno);
    return novoAluno;
  }

  function adicionarProfessor(professor) {
    const novoProfessor = { ...professor, id: String(Date.now()) };
    setProfessores(prev => [...prev, novoProfessor]);
    console.log('[AppContext] Professor adicionado:', novoProfessor);
    return novoProfessor;
  }

  function adicionarDisciplina(disciplina) {
    const novaDisciplina = { ...disciplina, id: String(Date.now()) };
    setDisciplinas(prev => [...prev, novaDisciplina]);
    console.log('[AppContext] Disciplina adicionada:', novaDisciplina);
    return novaDisciplina;
  }

  function getBoletim(alunoId) {
    return boletins[alunoId] || [];
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      loggedUser,
      alunos,
      professores,
      disciplinas,
      login,
      logout,
      adicionarAluno,
      adicionarProfessor,
      adicionarDisciplina,
      getBoletim,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext deve ser usado dentro de AppProvider');
  return ctx;
}
