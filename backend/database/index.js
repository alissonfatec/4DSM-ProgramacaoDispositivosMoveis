const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'app_scholar',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '123',
});

pool.on('connect', () => console.log('✅ PostgreSQL conectado'));
pool.on('error',   (err) => console.error('❌ Erro no pool PostgreSQL:', err));

module.exports = pool;
