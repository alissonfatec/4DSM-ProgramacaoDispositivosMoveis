const pool = require("../database");
const bcrypt = require("bcrypt"); // <-- Não esquece de importar o bcrypt!

async function listar(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM alunos ORDER BY nome");
    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function buscarPorMatricula(req, res) {
  const { matricula } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM alunos WHERE matricula = $1",
      [matricula],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function criar(req, res) {
  // Puxando a possível senha do body também
  const {
    nome,
    matricula,
    curso,
    email,
    telefone,
    cep,
    endereco,
    cidade,
    estado,
    senha,
  } = req.body;

  if (!nome || !matricula || !curso || !email) {
    return res
      .status(400)
      .json({ error: "Nome, matrícula, curso e email são obrigatórios" });
  }

  // Se a tela de cadastro não enviou senha, a gente padroniza como '123456'
  const senhaPadrao = senha || "123456";

  try {
    // 1. INICIA A TRANSAÇÃO: banco fica de sobreaviso
    await pool.query("BEGIN");

    // 2. Insere na tabela 'alunos' e recupera todos os dados salvos (com o ID novo)
    const resultAluno = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado],
    );

    const alunoCriado = resultAluno.rows[0];

    // 3. Gera o hash seguro da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaPadrao, salt);

    // 4. Cadastra o login na tabela 'usuarios', com o perfil de 'aluno'
    await pool.query(
      `INSERT INTO usuarios (email, senha_hash, perfil, referencia_id)
       VALUES ($1, $2, $3, $4)`,
      [email, senhaHash, "aluno", alunoCriado.id],
    );

    // 5. CONFIRMA TUDO! Salva as duas tabelas de uma vez
    await pool.query("COMMIT");

    return res.status(201).json({
      ...alunoCriado,
      mensagem: "Aluno e login criados com sucesso!",
    });
  } catch (err) {
    // 6. DEU BO? Cancela tudo para não salvar só o aluno sem senha!
    await pool.query("ROLLBACK");

    if (err.code === "23505") {
      // unique_violation
      return res
        .status(409)
        .json({ error: "Matrícula ou email já cadastrados" });
    }
    console.error("Erro ao criar aluno:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { listar, buscarPorMatricula, criar };
