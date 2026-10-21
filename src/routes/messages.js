const router = require('express').Router();
const auth = require('../middlewares/auth');
const { messageLimiter } = require('../middlewares/rateLimit');
const c = require('../controllers/messageController');

router.post('/', messageLimiter, c.create);
router.get('/', auth, c.list);
router.patch('/:id/read', auth, c.markRead);

module.exports = router;