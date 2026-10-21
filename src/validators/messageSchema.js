const { z } = require('zod');

exports.messageSchema = z.object({
  nama: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  isi: z.string().trim().min(1).max(2000),
  website: z.string().max(0).optional(),
});