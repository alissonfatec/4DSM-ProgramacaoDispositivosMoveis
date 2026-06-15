-- 0. Prepara o terreno (Destrói o antigo e cria o novo)
DROP DATABASE IF EXISTS app_scholar;
CREATE DATABASE app_scholar;

-- Conecta no banco recém-criado
\c app_scholar;
SET client_encoding = 'UTF8';

-- ==========================================
-- 1. Alunos (sem FK, pode criar primeiro)
-- ==========================================
CREATE TABLE alunos (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  matricula   VARCHAR(20)  UNIQUE NOT NULL,
  curso       VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  telefone    VARCHAR(20),
  cep         VARCHAR(10),
  endereco    VARCHAR(150),
  cidade      VARCHAR(100),
  estado      CHAR(2)
);

-- ==========================================
-- 2. Professores (sem FK, pode criar junto)
-- ==========================================
CREATE TABLE professores (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(100) NOT NULL,
  titulacao       VARCHAR(50),
  area            VARCHAR(100),
  tempo_docencia  INTEGER,
  email           VARCHAR(100) NOT NULL
);

-- ==========================================
-- 3. Usuarios (depende de alunos e professores)
-- ==========================================
CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(100) UNIQUE NOT NULL,
  senha_hash    VARCHAR(255) NOT NULL,
  perfil        VARCHAR(20)  NOT NULL CHECK (perfil IN ('aluno', 'professor', 'admin')),
  referencia_id INTEGER      NOT NULL
  -- referencia_id não tem FK declarada intencionalmente:
  -- aponta para alunos.id OU professores.id dependendo do perfil,
  -- FK polimórfica não é suportada nativamente no PostgreSQL.
  -- A integridade será garantida no controller.
);

-- ==========================================
-- 4. Disciplinas (depende de professores)
-- ==========================================
CREATE TABLE disciplinas (
  id             SERIAL PRIMARY KEY,
  nome           VARCHAR(100) NOT NULL,
  carga_horaria  INTEGER      NOT NULL,
  professor_id   INTEGER      REFERENCES professores(id) ON DELETE SET NULL,
  curso          VARCHAR(100),
  semestre       VARCHAR(20)
);

-- ==========================================
-- 5. Notas (depende de alunos e disciplinas)
-- ==========================================
CREATE TABLE notas (
  id             SERIAL PRIMARY KEY,
  aluno_id       INTEGER        NOT NULL REFERENCES alunos(id)      ON DELETE CASCADE,
  disciplina_id  INTEGER        NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1          NUMERIC(4,2)   CHECK (nota1 BETWEEN 0 AND 10),
  nota2          NUMERIC(4,2)   CHECK (nota2 BETWEEN 0 AND 10),
  media          NUMERIC(4,2)   GENERATED ALWAYS AS ((nota1 + nota2) / 2) STORED,
  situacao       VARCHAR(20)    GENERATED ALWAYS AS (
                   CASE WHEN ((nota1 + nota2) / 2) >= 5
                     THEN 'Aprovado'
                     ELSE 'Reprovado'
                   END
                 ) STORED,
  UNIQUE (aluno_id, disciplina_id)
);

-- ==========================================
-- 6. DADOS INICIAIS (Mock para a Prova)
-- ==========================================

-- Inserindo um Professor (Agora com dois SS!)
INSERT INTO professores (nome, titulacao, area, tempo_docencia, email) 
VALUES ('Prof. Carlos Silva', 'Mestre', 'Engenharia de Software', 10, 'carlos@scholar.com');

-- Inserindo um Aluno
INSERT INTO alunos (nome, matricula, curso, email, telefone) 
VALUES ('João Teste', '20261234', 'Análise de Sistemas', 'joao@teste.com', '11999999999');

-- Inserindo Usuários
INSERT INTO usuarios (email, senha_hash, perfil, referencia_id) 
VALUES 
('carlos@scholar.com', '$2b$10$b7zPXhfnT9Rvww6u6Ca8z.kBtTiBT2pZ2slBNvQ1KUXxlC4S7P3uW', 'professor', 1),
('joao@teste.com', '$2b$10$b7zPXhfnT9Rvww6u6Ca8z.kBtTiBT2pZ2slBNvQ1KUXxlC4S7P3uW', 'aluno', 1),
('admin@scholar.com', '$2b$10$b7zPXhfnT9Rvww6u6Ca8z.kBtTiBT2pZ2slBNvQ1KUXxlC4S7P3uW', 'admin', 0); 

-- Inserindo uma Disciplina
INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre) 
VALUES ('Programação para Dispositivos Móveis', 80, 1, 'Análise de Sistemas', '4º Semestre');

-- Inserindo uma Nota
INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
VALUES (1, 1, 8.5, 7.0);