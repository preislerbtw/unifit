const db = require("../config/database");

async function criar({ remetente_id, destinatario_id, mensagem }) {
  await db.query(
    `INSERT INTO chat_mensagem (remetente_id, destinatario_id, mensagem)
     VALUES (?, ?, ?)`,
    [remetente_id, destinatario_id, mensagem]
  );
}

async function listarEntre(user1, user2) {
  const [linhas] = await db.query(
    `SELECT * FROM chat_mensagem
     WHERE (remetente_id = ? AND destinatario_id = ?)
        OR (remetente_id = ? AND destinatario_id = ?)
     ORDER BY criada_em ASC`,
    [user1, user2, user2, user1]
  );
  return linhas;
}

async function listarConversas(userId) {
  const [linhas] = await db.query(
    `SELECT DISTINCT
       CASE WHEN remetente_id = ? THEN destinatario_id ELSE remetente_id END AS id
     FROM chat_mensagem
     WHERE remetente_id = ? OR destinatario_id = ?`,
    [userId, userId, userId]
  );
  return linhas;
}

module.exports = { criar, listarEntre, listarConversas };