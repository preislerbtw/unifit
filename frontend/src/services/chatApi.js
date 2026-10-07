// armazenamento provisório no navegador (localStorage).
// quando o back-end existir (tabela MENSAGEM + Socket.IO), troque estas funções por
// chamadas à API e use o socket no lugar do subscribeChat.
const CONV_KEY = "unifit:conversations";
const MSG_KEY = "unifit:messages";
const EVENT = "unifit:chat";

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
}

function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage indisponível: ignora
  }
  window.dispatchEvent(new Event(EVENT)); // avisa a aba atual
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

// uma conversa = um aluno + um professor
export function conversationId(studentId, professorUserId) {
  return `${studentId}|${professorUserId}`;
}

export async function ensureConversation({ student, professor }) {
  const id = conversationId(student.id, professor.id);
  const list = read(CONV_KEY);
  if (!list.some((c) => c.id === id)) {
    write(CONV_KEY, [
      ...list,
      {
        id,
        studentId: student.id,
        studentName: student.name,
        professorId: professor.id,
        professorName: professor.name,
      },
    ]);
  }
  return id;
}

export async function listMessages(convId) {
  return read(MSG_KEY)
    .filter((m) => m.conversationId === convId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export async function sendMessage(convId, from, text) {
  const message = {
    id: newId(),
    conversationId: convId,
    from, // { id, name, role }
    text,
    sentAt: new Date().toISOString(),
  };
  write(MSG_KEY, [...read(MSG_KEY), message]);
  return message;
}

// conversas do usuário, com a última mensagem de cada uma
export async function listConversationsOf(userId) {
  const messages = read(MSG_KEY);
  return read(CONV_KEY)
    .filter((c) => c.studentId === userId || c.professorId === userId)
    .map((c) => {
      const mine = messages
        .filter((m) => m.conversationId === c.id)
        .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
      return { ...c, last: mine[mine.length - 1] ?? null };
    });
}

// chama o callback quando algo muda (nesta aba ou em outra aba do navegador)
export function subscribeChat(callback) {
  const onStorage = (e) => {
    if (e.key === CONV_KEY || e.key === MSG_KEY) callback();
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
