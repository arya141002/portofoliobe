const { z } = require('zod');

exports.chatSchema = z.object({
  sessionId: z.string().min(8).max(64).regex(/^[a-zA-Z0-9_-]+$/),
  message: z.string().trim().min(1).max(500),
});