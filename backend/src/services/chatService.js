const AppError = require("../errors/AppError");
const chatRepository = require("../repositories/chatRepository");

async function enviar({ remetente_id, destinatario_id, mensagem }) {
  if (!remetente_id || !destinatario_id || !mensagem?.trim()) {
    throw new AppError(400, "Dados da mensagem incompletos.");
  }
  await chatRepository.criar({
    remetente_id,
    destinatario_id,
    mensagem: mensagem.trim(),
  });
}

async function listarMensagens(user1, user2) {
  if (!user1 || !user2) throw new AppError(400, "Informe user1 e user2.");
  return chatRepository.listarEntre(user1, user2);
}

async function listarConversas(userId) {
  return chatRepository.listarConversas(userId);
}

module.exports = { enviar, listarMensagens, listarConversas };