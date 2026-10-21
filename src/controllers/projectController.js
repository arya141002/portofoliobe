const pool = require('../config/db');
const { projectSchema } = require('../validators/projectSchema');

const notFound = (res) =>
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Proyek tidak ditemukan' } });

const invalid = (res, err) =>
  res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: err.issues },
  });

exports.list = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY urutan ASC, id ASC');
  res.json({ data: rows });
};

exports.getOne = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
  if (!rows[0]) return notFound(res);
  res.json({ data: rows[0] });
};

exports.create = async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  const p = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO projects (judul, deskripsi, tech_stack, link_demo, link_repo, gambar, urutan)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [p.judul, p.deskripsi, p.tech_stack, p.link_demo ?? null, p.link_repo ?? null, p.gambar ?? null, p.urutan]
  );
  res.status(201).json({ data: rows[0] });
};

exports.update = async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) return invalid(res, parsed.error);
  const p = parsed.data;
  const { rows } = await pool.query(
    `UPDATE projects
     SET judul=$1, deskripsi=$2, tech_stack=$3, link_demo=$4, link_repo=$5,
         gambar=$6, urutan=$7, updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [p.judul, p.deskripsi, p.tech_stack, p.link_demo ?? null, p.link_repo ?? null, p.gambar ?? null, p.urutan, req.params.id]
  );
  if (!rows[0]) return notFound(res);
  res.json({ data: rows[0] });
};

exports.remove = async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  if (!rowCount) return notFound(res);
  res.status(204).send();
};