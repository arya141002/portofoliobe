const router = require('express').Router();
const auth = require('../middlewares/auth');
const c = require('../controllers/projectController');

router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;