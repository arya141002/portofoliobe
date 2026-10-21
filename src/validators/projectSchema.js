const { z } = require('zod');

const url = z.string().url().max(255).nullable().optional();

exports.projectSchema = z.object({
  judul: z.string().min(1).max(150),
  deskripsi: z.string().min(1),
  tech_stack: z.array(z.string().min(1)).default([]),
  link_demo: url,
  link_repo: url,
  gambar: url,
  urutan: z.number().int().default(0),
});