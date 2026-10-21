const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const pool = require('../config/db');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

exports.login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid' } });
  }
  const { email, password } = parsed.data;

  const { rows } = await pool.query('SELECT id, password_hash FROM admins WHERE email = $1', [email]);
  const admin = rows[0];
  const ok = admin && (await bcrypt.compare(password, admin.password_hash));
  if (!ok) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Email atau password salah' } });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  res.json({ data: { token } });
};