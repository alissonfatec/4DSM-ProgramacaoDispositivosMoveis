// professoresController.js
const pool = require('../database');

async function listar(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM professores ORDER BY nome');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function criar(req, res) {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { listar, criar };
