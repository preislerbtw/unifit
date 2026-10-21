const { Router } = require("express");
const auth = require("../controllers/authController");

const router = Router();

router.post("/cadastro", auth.cadastrar);
router.post("/login", auth.login);

module.exports = router;