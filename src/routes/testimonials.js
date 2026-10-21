const router = require('express').Router();
const auth = require('../middlewares/auth');
const { testimonialLimiter } = require('../middlewares/rateLimit');
const c = require('../controllers/testimonialController');

router.get('/', c.listPublic);
router.post('/', testimonialLimiter, c.create);
router.patch('/:id', auth, c.setStatus);
router.delete('/:id', auth, c.remove);

module.exports = router;