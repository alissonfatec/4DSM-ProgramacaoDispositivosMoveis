import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Dados em memória — usados pelas telas ainda não migradas para o backend
  const [alunos,      setAlunos]      = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    console.log('[AppContext] Inicializado — dados virão do backend.');
  }, []);

  function adicionarAluno(aluno) {
    const novoAluno = { ...aluno, id: String(Date.now()) };
    setAlunos(prev => [...prev, novoAluno]);
    return novoAluno;
  }

  function adicionarProfessor(professor) {
    const novoProfessor = { ...professor, id: String(Date.now()) };
    setProfessores(prev => [...prev, novoProfessor]);
    return novoProfessor;
  }

  function adicionarDisciplina(disciplina) {
    const novaDisciplina = { ...disciplina, id: String(Date.now()) };
    setDisciplinas(prev => [...prev, novaDisciplina]);
    return novaDisciplina;
  }

  return (
    <AppContext.Provider value={{
      alunos,
      professores,
      disciplinas,
      adicionarAluno,
      adicionarProfessor,
      adicionarDisciplina,
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