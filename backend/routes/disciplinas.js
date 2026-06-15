const express    = require('express');
const controller = require('../controllers/disciplinasController');
const auth       = require('../middleware/auth');
const router     = express.Router();

router.get('/',  auth, controller.listar);
router.post('/', auth, controller.criar);

// Busca só as matérias do professor logado
router.get('/minhas', auth, controller.listarMinhasDisciplinas); 
// Busca os alunos (e as notas) de uma matéria específica
router.get('/:id/alunos', auth, controller.listarAlunosDaDisciplina); 

module.exports = router;