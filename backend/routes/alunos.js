const express     = require('express');
const controller  = require('../controllers/alunosController');
const auth        = require('../middleware/auth');
const router      = express.Router();

router.get('/',                auth, controller.listar);
router.get('/:matricula',      auth, controller.buscarPorMatricula);
router.post('/',               auth, controller.criar);

module.exports = router;
