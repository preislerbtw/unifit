const API_URL = "http://localhost:3000";

export function conversationId(studentId, professorId) {
  return `${studentId}|${professorId}`;
}

export async function ensureConversation({
  student,
  professor,
}) {
  return conversationId(
    student.id,
    professor.id
  );
}

export async function listMessages(convId) {
  const [
    studentId,
    professorId,
  ] = convId.split("|");

  const response = await fetch(
    `${API_URL}/mensagens?user1=${studentId}&user2=${professorId}`
  );

  const rows = await response.json();

  return rows.map((msg) => ({
    id: msg.id,
    text: msg.mensagem,
    sentAt: msg.criada_em,
    from: {
      id: msg.remetente_id,
    },
  }));
}

export async function sendMessage(
  convId,
  from,
  text
) {

  const [
    studentId,
    professorId,
  ] = convId.split("|");

  const destinatarioId =
    String(from.id) === String(studentId)
      ? professorId
      : studentId;

  const response = await fetch(
    `${API_URL}/mensagem`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        remetente_id: from.id,
        destinatario_id: destinatarioId,
        mensagem: text,
      }),
    }
  );

  return response.json();
}

export async function listConversationsOf(
  userId
) {
  const response = await fetch(
    `${API_URL}/conversas/${userId}`
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export function subscribeChat(
  callback
) {
  const interval =
    setInterval(
      callback,
      2000
    );

  return () => {
    clearInterval(interval);
  };
}

// history: [{ role: "user" | "assistant", content: string }]
export async function sendAiMessage(history) {
  const response = await fetch(`${API_URL}/chat-ia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensagens: history }),
  });

  if (!response.ok) {
    throw new Error("Falha ao falar com a IA.");
  }

  const data = await response.json();
  return data.resposta;
}