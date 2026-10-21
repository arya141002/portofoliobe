const router = require('express').Router();
const { chatLimiter, chatDailyLimiter } = require('../middlewares/rateLimit');
const { chat } = require('../controllers/chatController');

router.post('/', chatLimiter, chatDailyLimiter, chat);

module.exports = router;