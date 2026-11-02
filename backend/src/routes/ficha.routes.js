const { Router } = require("express");
const ficha = require("../controllers/fichaController");

const router = Router();

router.get("/fichas", ficha.listarVisiveis);
router.get("/usuarios/:idUsuario/fichas", ficha.listarDoDono);
router.get("/fichas/:id", ficha.buscar);
router.post("/fichas", ficha.criar);
router.put("/fichas/:id", ficha.atualizar);
router.delete("/fichas/:id", ficha.excluir);

module.exports = router;
