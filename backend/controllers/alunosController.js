const pool = require('../database');

async function listar(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM alunos ORDER BY nome'
    );
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar alunos:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function buscarPorMatricula(req, res) {
  const { matricula } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM alunos WHERE matricula = $1',
      [matricula]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function criar(req, res) {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula || !curso || !email) {
    return res.status(400).json({ error: 'Nome, matrícula, curso e email são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'Matrícula já cadastrada' });
    }
    console.error('Erro ao criar aluno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { listar, buscarPorMatricula, criar };
