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
    `SELECT
  c.contato_id AS id,
  u.nome,
  u.perfil,
  m.mensagem AS ultima_mensagem,
  m.criada_em AS ultima_em
  FROM (
  SELECT
    CASE WHEN remetente_id = ? THEN destinatario_id ELSE remetente_id END AS contato_id,
    MAX(id) AS ultimo_id
  FROM chat_mensagem
  WHERE remetente_id = ? OR destinatario_id = ?
  GROUP BY contato_id
) c
JOIN chat_mensagem m ON m.id = c.ultimo_id
JOIN usuario u ON u.idUsuario = c.contato_id
ORDER BY m.criada_em DESC`,
    [userId, userId, userId]
  );
  return linhas;
}

module.exports = { criar, listarEntre, listarConversas };