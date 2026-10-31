const { Router } = require("express");
const professor = require("../controllers/professorController");

const router = Router();

router.get("/professores", professor.listar);

module.exports = router;