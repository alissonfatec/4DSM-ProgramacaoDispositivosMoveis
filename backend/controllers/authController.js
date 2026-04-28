const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../database');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // 1. Busca o usuário
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = rows[0];

    // 2. Valida a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. FK polimórfica: busca o nome na tabela correta pelo perfil
    let nome = 'Usuário';
    if (usuario.perfil === 'aluno') {
      const aluno = await pool.query(
        'SELECT nome FROM alunos WHERE id = $1',
        [usuario.referencia_id]
      );
      if (aluno.rows.length > 0) nome = aluno.rows[0].nome;

    } else if (usuario.perfil === 'professor') {
      const prof = await pool.query(
        'SELECT nome FROM professores WHERE id = $1',
        [usuario.referencia_id]
      );
      if (prof.rows.length > 0) nome = prof.rows[0].nome;
    }

    // 4. Gera o JWT
    const payload = {
      id:            usuario.id,
      email:         usuario.email,
      perfil:        usuario.perfil,
      referencia_id: usuario.referencia_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    return res.json({
      token,
      usuario: { nome, perfil: usuario.perfil },
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { login };
