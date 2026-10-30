const chatService = require("../services/chatService");
const aiChatService = require("../services/aiChatService");

async function enviar(req, res) {
  await chatService.enviar(req.body);
  res.status(201).json({ success: true });
  // 201 - requisicao bem sucedida e novo recurso foi criado
}

async function listarMensagens(req, res) {
  const { user1, user2 } = req.query;
  res.json(await chatService.listarMensagens(user1, user2));
}

async function listarConversas(req, res) {
  res.json(await chatService.listarConversas(req.params.userId));
}

async function conversarComIa(req, res) {
  const resposta = await aiChatService.responder(req.body.mensagens);
  res.json({ resposta });
}

module.exports = {
  enviar,
  listarMensagens,
  listarConversas,
  conversarComIa,
};