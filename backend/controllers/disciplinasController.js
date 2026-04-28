const pool = require('../database');

async function listar(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT d.*, p.nome AS professor_nome
       FROM disciplinas d
       LEFT JOIN professores p ON p.id = d.professor_id
       ORDER BY d.nome`
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function criar(req, res) {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  if (!nome || !carga_horaria) {
    return res.status(400).json({ error: 'Nome e carga horária são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { listar, criar };
