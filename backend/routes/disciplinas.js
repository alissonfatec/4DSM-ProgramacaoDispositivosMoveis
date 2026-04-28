const express    = require('express');
const controller = require('../controllers/disciplinasController');
const auth       = require('../middleware/auth');
const router     = express.Router();

router.get('/',  auth, controller.listar);
router.post('/', auth, controller.criar);

module.exports = router;
