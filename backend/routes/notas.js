const express    = require('express');
const controller = require('../controllers/notasController');
const auth       = require('../middleware/auth');
const router     = express.Router();

router.post('/',       auth, controller.criar);
router.put('/:id',     auth, controller.atualizar);

module.exports = router;
