-- seed.sql
-- Dados de teste para desenvolvimento

INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
VALUES ('Maria Souza', '2024001', 'DSM', 'maria@fatec.sp.gov.br', '12999990001',
        '12245000', 'Rua das Flores, 100', 'São José dos Campos', 'SP');

INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
VALUES ('André Olímpio', 'Mestre', 'Desenvolvimento Mobile', 8, 'andre@fatec.sp.gov.br');

-- senha: 'fatec123' (você vai gerar o hash real via bcrypt no controller,
-- este hash abaixo é só pra seed de dev)
INSERT INTO usuarios (email, senha_hash, perfil, referencia_id)
VALUES ('maria@fatec.sp.gov.br',
        '$$2b$10$AxLD2E3.P1oMbdmTXU6VGeEeg3xYof3M0z3JtRQcc9p0d9DusMqWG',
        'aluno', 1);

INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
VALUES ('Programação para Dispositivos Móveis I', 80, 1, 'DSM', '4º Semestre'),
       ('Banco de Dados Relacional', 80, 1, 'DSM', '4º Semestre');

INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2)
VALUES (1, 1, 8.0, 7.0),
       (1, 2, 6.5, 9.0);
-- media e situacao são calculadas automaticamente pelo PostgreSQL