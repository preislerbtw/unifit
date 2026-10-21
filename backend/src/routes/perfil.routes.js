const { Router } = require("express");
const perfil = require("../controllers/perfilController");

const router = Router();

router.post("/perfil/medidas", perfil.atualizarMedidas);

module.exports = router;