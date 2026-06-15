const pool = require('../database');

// [MANTIDO] Lista todas as disciplinas (geral)
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

// [MANTIDO] Cria uma nova disciplina
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

// [NOVO - REQUISITO 1] Lista apenas as disciplinas do professor logado
async function listarMinhasDisciplinas(req, res) {
  try {
    const professorId = req.usuario.referencia_id; 
    
    if (req.usuario.perfil !== 'professor') {
      return res.status(403).json({ error: "Apenas professores têm acesso." });
    }

    const { rows } = await pool.query(
      "SELECT * FROM disciplinas WHERE professor_id = $1 ORDER BY nome",
      [professorId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar disciplinas:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// [NOVO - REQUISITO 2] Lista os alunos da disciplina (usando a tabela de notas como ligação)
async function listarAlunosDaDisciplina(req, res) {
  try {
    const disciplinaId = req.params.id;
    const professorId = req.usuario.referencia_id;

    // Trava de Segurança: Essa disciplina é desse professor?
    if (req.usuario.perfil === 'professor') {
      const checkDisc = await pool.query("SELECT professor_id FROM disciplinas WHERE id = $1", [disciplinaId]);
      if (checkDisc.rows.length === 0) return res.status(404).json({ error: "Disciplina não encontrada" });
      if (checkDisc.rows[0].professor_id !== professorId) {
        return res.status(403).json({ error: "Você não é o dono desta disciplina!" });
      }
    }

    // Busca os alunos e as notas usando INNER JOIN
    const query = `
      SELECT a.id as aluno_id, a.nome, a.matricula, 
             n.id as nota_id, n.nota1, n.nota2, n.media, n.situacao
      FROM alunos a
      INNER JOIN notas n ON a.id = n.aluno_id
      WHERE n.disciplina_id = $1
      ORDER BY a.nome ASC
    `;
    const { rows } = await pool.query(query, [disciplinaId]);
    return res.json(rows);

  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { listar, criar, listarMinhasDisciplinas, listarAlunosDaDisciplina };