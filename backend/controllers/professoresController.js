// professoresController.js
const pool = require("../database");
const bcrypt = require("bcrypt"); // <-- Import da biblioteca de criptografia

async function listar(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM professores ORDER BY nome",
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function criar(req, res) {
  // Agora recebemos também uma possível "senha" do frontend
  const { nome, titulacao, area, tempo_docencia, email, senha } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  // Se o frontend não mandar senha, usamos '123456' como padrão
  const senhaPadrao = senha || "123456";

  try {
    // 1. INICIA A TRANSAÇÃO: banco fica aguardando tudo dar certo
    await pool.query("BEGIN");

    // 2. Cadastra o professor e pega os dados salvos (incluindo o ID gerado)
    const resultProf = await pool.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email],
    );

    const professorCriado = resultProf.rows[0];

    // 3. Gera o hash seguro da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaPadrao, salt);

    // 4. Cadastra o login na tabela usuarios, ligando pelo referencia_id
    await pool.query(
      `INSERT INTO usuarios (email, senha_hash, perfil, referencia_id)
       VALUES ($1, $2, $3, $4)`,
      [email, senhaHash, "professor", professorCriado.id],
    );

    // 5. CONFIRMA TUDO: salva o professor e o usuário de uma vez só!
    await pool.query("COMMIT");

    // Devolve o professor criado para o app
    return res.status(201).json({
      ...professorCriado,
      mensagem: "Professor e login criados com sucesso!",
    });
  } catch (err) {
    // 6. DEU ERRO? Desfaz tudo para não criar cadastros fantasmas
    await pool.query("ROLLBACK");
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao criar professor" });
  }
}

module.exports = { listar, criar };
