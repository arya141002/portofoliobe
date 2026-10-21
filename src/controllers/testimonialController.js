const pool = require('../config/db');
const { testimonialSchema, statusSchema } = require('../validators/testimonialSchema');

const invalid = (res, err) =>
  res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: err.issues },
  });

const notFound = (res) =>
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Testimonial tidak ditemukan' } });

// Publik: hanya yang approved
exports.listPublic = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nama, jabatan_instansi, isi, rating, created_at
     FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC`
  );
  res.json({ data: rows });
};

// Publik: kirim, status otomatis pending
exports.create = async (req, res) => {
  const parsed = testimonialSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  const t = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO testimonials (nama, jabatan_instansi, isi, rating)
     VALUES ($1, $2, $3, $4) RETURNING id, status, created_at`,
    [t.nama, t.jabatan_instansi ?? null, t.isi, t.rating]
  );
  res.status(201).json({ data: rows[0] });
};

// Admin: semua, bisa difilter ?status=pending
exports.listAdmin = async (req, res) => {
  const { status } = req.query;
  const allowed = ['pending', 'approved', 'rejected'];
  if (status && !allowed.includes(status)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Status tidak valid' } });
  }
  const { rows } = status
    ? await pool.query('SELECT * FROM testimonials WHERE status = $1 ORDER BY created_at DESC', [status])
    : await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json({ data: rows });
};

// Admin: approve / reject
exports.setStatus = async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  const { rows } = await pool.query(
    'UPDATE testimonials SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [parsed.data.status, req.params.id]
  );
  if (!rows[0]) return notFound(res);
  res.json({ data: rows[0] });
};

// Admin: hapus
exports.remove = async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
  if (!rowCount) return notFound(res);
  res.status(204).send();
};