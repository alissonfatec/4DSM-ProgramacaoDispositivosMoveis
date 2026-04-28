-- migrations.sql
-- App Scholar – Schema completo
-- Ordem importa por causa das FKs

-- 1. Alunos (sem FK, pode criar primeiro)
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

-- 2. Professores (sem FK, pode criar junto)
CREATE TABLE professores (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(100) NOT NULL,
  titulacao       VARCHAR(50),
  area            VARCHAR(100),
  tempo_docencia  INTEGER,
  email           VARCHAR(100) NOT NULL
);

-- 3. Usuarios (depende de alunos e professores)
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

-- 4. Disciplinas (depende de professores)
CREATE TABLE disciplinas (
  id             SERIAL PRIMARY KEY,
  nome           VARCHAR(100) NOT NULL,
  carga_horaria  INTEGER      NOT NULL,
  professor_id   INTEGER      REFERENCES professores(id) ON DELETE SET NULL,
  curso          VARCHAR(100),
  semestre       VARCHAR(20)
);

-- 5. Notas (depende de alunos e disciplinas)
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