const { Router } = require("express");

const router = Router();

router.use(require("./auth.routes"));
router.use(require("./perfil.routes"));
router.use(require("./chat.routes"));
router.use(require("./professor.routes"));
router.use(require("./ficha.routes"));
router.use(require("./agendamento.routes"));

module.exports = router;