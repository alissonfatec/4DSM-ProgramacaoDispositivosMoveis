const express    = require('express');
const controller = require('../controllers/boletimController');
const auth       = require('../middleware/auth');
const router     = express.Router();

router.get('/:matricula', auth, controller.consultar);

module.exports = router;
