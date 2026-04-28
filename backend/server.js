require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./routes/auth');
const alunosRoutes      = require('./routes/alunos');
const professoresRoutes = require('./routes/professores');
const disciplinasRoutes = require('./routes/disciplinas');
const notasRoutes       = require('./routes/notas');
const boletimRoutes     = require('./routes/boletim');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api',          authRoutes);
app.use('/api/alunos',   alunosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/notas',    notasRoutes);
app.use('/api/boletim',  boletimRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Handler global de erros
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
