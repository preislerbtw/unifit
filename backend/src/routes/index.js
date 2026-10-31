const { Router } = require("express");

const router = Router();

router.use(require("./auth.routes"));
router.use(require("./perfil.routes"));
router.use(require("./chat.routes"));
router.use(require("./professor.routes"));

module.exports = router;