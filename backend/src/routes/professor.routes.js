const { Router } = require("express");
const professor = require("../controllers/professorController");

const router = Router();

router.get("/professores", professor.listar);
router.get("/alunos/:idUsuario/professores", professor.listarDoAluno);
router.post("/alunos/:idUsuario/professores", professor.adicionarPorCodigo);
router.get("/professores/:idProfessor/alunos", professor.listarAlunos);
router.post("/professores/:idProfessor/alunos", professor.adicionarAlunoPorCodigo);
router.get("/alunos", professor.listarTodosAlunos);

module.exports = router;