const pool = require('../database');

async function criar(req, res) {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

  if (!aluno_id || !disciplina_id || nota1 == null || nota2 == null) {
    return res.status(400).json({ error: 'aluno_id, disciplina_id, nota1 e nota2 são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [aluno_id, disciplina_id, nota1, nota2]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Nota já cadastrada para este aluno nesta disciplina' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nota1, nota2 } = req.body;

  if (nota1 == null || nota2 == null) {
    return res.status(400).json({ error: 'nota1 e nota2 são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE notas SET nota1 = $1, nota2 = $2
       WHERE id = $3 RETURNING *`,
      [nota1, nota2, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { criar, atualizar };
