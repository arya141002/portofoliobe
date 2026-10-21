const { z } = require('zod');

exports.testimonialSchema = z.object({
  nama: z.string().trim().min(1).max(100),
  jabatan_instansi: z.string().trim().max(150).optional(),
  isi: z.string().trim().min(10).max(1000),
  rating: z.number().int().min(1).max(5),
  website: z.string().max(0).optional(), // honeypot
});

exports.statusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});