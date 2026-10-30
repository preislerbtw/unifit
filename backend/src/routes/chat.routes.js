const { Router } = require("express");
const chat = require("../controllers/chatController");

const router = Router();

router.post("/mensagem", chat.enviar);
router.get("/mensagens", chat.listarMensagens);
router.get("/conversas/:userId", chat.listarConversas);
router.post("/chat-ia", chat.conversarComIa);

module.exports = router;