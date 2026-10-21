const router = require('express').Router();
const auth = require('../middlewares/auth');
const c = require('../controllers/testimonialController');

router.get('/', auth, c.listAdmin);

module.exports = router;