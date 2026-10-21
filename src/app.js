const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pool = require('./config/db');

const app = express();
const auth = require('./middlewares/auth');
app.get('/api/me', auth, (req, res) => res.json({ admin: req.admin }));

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', require('./routes/auth'));

// 404: dipasang setelah semua route
app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Endpoint tidak ditemukan' } });
});

// Error handler: dipasang paling akhir, harus punya 4 parameter
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } });
});

module.exports = app;