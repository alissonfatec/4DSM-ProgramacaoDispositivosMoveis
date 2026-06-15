const pool = require("../database");

// [ATUALIZADO] Adicionada trava de segurança
async function criar(req, res) {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

  if (!aluno_id || !disciplina_id || nota1 == null || nota2 == null) {
    return res.status(400).json({
      error: "aluno_id, disciplina_id, nota1 e nota2 são obrigatórios",
    });
  }

  try {
    // [NOVO] Trava de Segurança: Verifica se a disciplina pertence ao professor logado
    if (req.usuario.perfil === 'professor') {
      const checkDisc = await pool.query("SELECT professor_id FROM disciplinas WHERE id = $1", [disciplina_id]);
      if (checkDisc.rows.length === 0) return res.status(404).json({ error: "Disciplina não encontrada" });
      if (checkDisc.rows[0].professor_id !== req.usuario.referencia_id) {
        return res.status(403).json({ error: "Você só pode lançar notas nas suas próprias disciplinas." });
      }
    }

    // [MANTIDO] O seu Upsert genial
    const { rows } = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (aluno_id, disciplina_id) 
       DO UPDATE SET nota1 = EXCLUDED.nota1, nota2 = EXCLUDED.nota2
       RETURNING *`,
      [aluno_id, disciplina_id, nota1, nota2],
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor ao salvar nota" });
  }
}

// [ATUALIZADO] Adicionada trava de segurança com JOIN
async function atualizar(req, res) {
  const { id } = req.params;
  const { nota1, nota2 } = req.body;

  if (nota1 == null || nota2 == null) {
    return res.status(400).json({ error: "nota1 e nota2 são obrigatórios" });
  }

  try {
    // [NOVO] Trava de Segurança: Como aqui só recebemos o ID da nota, precisamos fazer um JOIN para saber o dono da disciplina
    if (req.usuario.perfil === 'professor') {
      const checkQuery = `
        SELECT d.professor_id 
        FROM notas n 
        INNER JOIN disciplinas d ON n.disciplina_id = d.id 
        WHERE n.id = $1
      `;
      const check = await pool.query(checkQuery, [id]);
      if (check.rows.length > 0 && check.rows[0].professor_id !== req.usuario.referencia_id) {
        return res.status(403).json({ error: "Você só pode alterar notas das suas disciplinas." });
      }
    }

    // [MANTIDO] O seu UPDATE padrão
    const { rows } = await pool.query(
      `UPDATE notas SET nota1 = $1, nota2 = $2
       WHERE id = $3 RETURNING *`,
      [nota1, nota2, id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { criar, atualizar };