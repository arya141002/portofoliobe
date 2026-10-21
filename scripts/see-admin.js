require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

const [email, password] = process.argv.slice(2);

(async () => {
  try {
    if (!email || !password) throw new Error('Pakai: node scripts/seed-admin.js <email> <password>');
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
    console.log('Admin dibuat:', email);
  } catch (err) {
    console.error('Gagal:', err.message);
  } finally {
    await pool.end();
  }
})();