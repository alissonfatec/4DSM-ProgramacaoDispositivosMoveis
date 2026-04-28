const pool = require('../database');

async function consultar(req, res) {
  const { matricula } = req.params;

  try {
    // Busca o aluno
    const alunoResult = await pool.query(
      'SELECT * FROM alunos WHERE matricula = $1',
      [matricula]
    );

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = alunoResult.rows[0];

    // JOIN: notas + disciplinas + professor
    const notasResult = await pool.query(
      `SELECT
         d.nome        AS disciplina,
         d.semestre,
         d.carga_horaria,
         p.nome        AS professor,
         n.nota1,
         n.nota2,
         n.media,
         n.situacao
       FROM notas n
       JOIN disciplinas d ON d.id = n.disciplina_id
       LEFT JOIN professores p ON p.id = d.professor_id
       WHERE n.aluno_id = $1
       ORDER BY d.semestre, d.nome`,
      [aluno.id]
    );

    return res.json({
      aluno:       aluno.nome,
      matricula:   aluno.matricula,
      curso:       aluno.curso,
      disciplinas: notasResult.rows,
    });

  } catch (err) {
    console.error('Erro ao consultar boletim:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { consultar };
