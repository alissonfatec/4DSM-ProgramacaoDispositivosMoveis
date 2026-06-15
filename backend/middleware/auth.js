const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, 'chave_secreta_para_a_prova', (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    
    req.user = payload;    // Mantém seus códigos antigos funcionando
    req.usuario = payload; // Faz os códigos novos do professor funcionarem
    
    next();
  });
}

module.exports = authenticateToken;