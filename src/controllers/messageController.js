const pool = require('../config/db');
const { messageSchema } = require('../validators/messageSchema');

exports.create = async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: parsed.error.issues },
    });
  }
  const { nama, email, isi } = parsed.data;
  const { rows } = await pool.query(
    'INSERT INTO messages (nama, email, isi) VALUES ($1, $2, $3) RETURNING id, created_at',
    [nama, email, isi]
  );
  res.status(201).json({ data: rows[0] });
};

exports.list = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.json({ data: rows });
};

exports.markRead = async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE messages SET sudah_dibaca = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Pesan tidak ditemukan' } });
  }
  res.json({ data: rows[0] });
};