const pool = require("../database");

async function consultar(req, res) {
  const { matricula } = req.params;

  try {
    // 1. Busca o aluno
    const alunoResult = await pool.query(
      "SELECT * FROM alunos WHERE matricula = $1",
      [matricula],
    );

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const aluno = alunoResult.rows[0];

    // 2. A MÁGICA: Invertemos o JOIN! Começa pelas DISCIPLINAS e junta com as notas (LEFT JOIN)
    const notasResult = await pool.query(
      `SELECT
         n.id          AS nota_id,
         d.id          AS disciplina_id,
         d.nome        AS disciplina,
         d.semestre,
         d.carga_horaria,
         p.nome        AS professor,
         n.nota1,
         n.nota2,
         n.media,
         COALESCE(n.situacao, 'Sem Nota') AS situacao 
       FROM disciplinas d
       LEFT JOIN notas n ON n.disciplina_id = d.id AND n.aluno_id = $1
       LEFT JOIN professores p ON p.id = d.professor_id
       ORDER BY d.semestre, d.nome`,
      [aluno.id], // Passamos o ID do aluno para o ON do LEFT JOIN
    );

    return res.json({
      aluno_id: aluno.id,
      aluno: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      disciplinas: notasResult.rows,
    });
  } catch (err) {
    console.error("Erro ao consultar boletim:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { consultar };
