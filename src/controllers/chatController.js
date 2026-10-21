const pool = require('../config/db');
const { chatSchema } = require('../validators/chatSchema');
const { ask } = require('../services/llmService');

const HISTORY_LIMIT = 10;

exports.chat = async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid', details: parsed.error.issues },
    });
  }
  const { sessionId, message } = parsed.data;

  const { rows } = await pool.query(
    'SELECT role, isi FROM chat_logs WHERE session_id = $1 ORDER BY id DESC LIMIT $2',
    [sessionId, HISTORY_LIMIT]
  );
  const history = rows.reverse().map((r) => ({ role: r.role, content: r.isi }));
  while (history.length && history[0].role !== 'user') history.shift(); // harus diawali user

  let reply;
  try {
    reply = await ask(history, message);
  } catch (err) {
    console.error('LLM error:', err.message);
    return res.status(502).json({
      error: { code: 'LLM_UNAVAILABLE', message: 'Chatbot sedang tidak tersedia. Silakan gunakan form kontak.' },
    });
  }
  if (!reply) reply = 'Maaf, saya belum bisa menjawab itu. Silakan gunakan form kontak.';

  // Simpan sepasang sekaligus, hanya jika LLM berhasil
  await pool.query(
    `INSERT INTO chat_logs (session_id, role, isi) VALUES ($1, 'user', $2), ($1, 'assistant', $3)`,
    [sessionId, message, reply]
  );
  res.json({ data: { reply } });
};