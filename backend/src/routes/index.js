const { Router } = require("express");

const router = Router();

router.use(require("./auth.routes"));
router.use(require("./perfil.routes"));
router.use(require("./chat.routes"));

module.exports = router;