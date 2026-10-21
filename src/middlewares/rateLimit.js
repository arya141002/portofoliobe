const rateLimit = require('express-rate-limit');

const make = (windowMs, limit) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Terlalu banyak permintaan, coba lagi nanti' } },
  });

exports.messageLimiter = make(60 * 60 * 1000, 5);
exports.loginLimiter = make(15 * 60 * 1000, 5);
exports.testimonialLimiter = make(60 * 60 * 1000, 3);
exports.chatLimiter = make(60 * 1000, 10);
exports.chatDailyLimiter = make(24 * 60 * 60 * 1000, 100);