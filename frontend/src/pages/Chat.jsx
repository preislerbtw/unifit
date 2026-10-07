import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { getSession } from "../services/session";
import { listarProfessores } from "../services/professoresApi";
import { listStudentsOfProfessor } from "../services/studentsApi";
import {
  conversationId,
  ensureConversation,
  listConversationsOf,
  listMessages,
  sendMessage,
  subscribeChat,
} from "../services/chatApi";
import { levelLabel } from "../utils/levels";
import "../styles/Chat.css";

function time(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Chat entre aluno e professor (RF15).
// Aluno: conversa com qualquer professor. Professor: conversa com seus alunos.
function Chat() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [session] = useState(getSession);
  const isStudent = session.role === "aluno";

  const [baseContacts, setBaseContacts] = useState([]);
  const [convs, setConvs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  // contatos possíveis
  useEffect(() => {
    async function load() {
      if (isStudent) {
        const profs = await listarProfessores();
        setBaseContacts(
          profs.map((p) => ({
            id: `professor-${p.id}`,
            name: p.nome,
            subtitle: p.especialidade,
          }))
        );
      } else {
        const students = await listStudentsOfProfessor(session, {
          statuses: ["pending", "confirmed"],
        });
        setBaseContacts(
          students.map((s) => ({
            id: s.id,
            name: s.name,
            subtitle: `Nível ${levelLabel(s.level).toLowerCase()}`,
          }))
        );
      }
    }
    load();
  }, [isStudent, session]);

  const currentConvId = partnerId
    ? isStudent
      ? conversationId(session.userId, partnerId)
      : conversationId(partnerId, session.userId)
    : null;

  const refresh = useCallback(async () => {
    setConvs(await listConversationsOf(session.userId));
    if (currentConvId) setMessages(await listMessages(currentConvId));
    else setMessages([]);
  }, [session.userId, currentConvId]);

  // carrega e fica ouvindo mudanças (nesta aba e em outras abas)
  useEffect(() => {
    refresh();
    return subscribeChat(refresh);
  }, [refresh]);

  // junta os contatos com as conversas já existentes
  const contacts = useMemo(() => {
    const map = new Map(baseContacts.map((c) => [c.id, { ...c, last: null }]));
    for (const conv of convs) {
      const id = isStudent ? conv.professorId : conv.studentId;
      const name = isStudent ? conv.professorName : conv.studentName;
      const entry = map.get(id) ?? { id, name, subtitle: "" };
      map.set(id, { ...entry, last: conv.last });
    }
    return [...map.values()].sort((a, b) => {
      // conversas com mensagem recente primeiro
      const ta = a.last?.sentAt ?? "";
      const tb = b.last?.sentAt ?? "";
      return tb.localeCompare(ta) || a.name.localeCompare(b.name);
    });
  }, [baseContacts, convs, isStudent]);

  const partner = contacts.find((c) => c.id === partnerId) ?? null;

  // rola para a última mensagem
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages.length, partnerId]);

  async function handleSend(e) {
    e.preventDefault();
    const content = text.trim();
    if (!content || !partner) return;

    const me = { id: session.userId, name: session.name };
    const convId = await ensureConversation(
      isStudent
        ? { student: me, professor: { id: partner.id, name: partner.name } }
        : { student: { id: partner.id, name: partner.name }, professor: me }
    );
    await sendMessage(convId, { ...me, role: session.role }, content);
    setText("");
  }

  return (
    <div className="chat-page">
      <h1>Chat</h1>

      <div className={`chat-layout ${partnerId ? "has-thread" : ""}`}>
        <aside className="chat-list" aria-label="Conversas">
          {contacts.length === 0 && (
            <p className="chat-empty">
              {isStudent
                ? "Nenhum professor disponível."
                : "Você ainda não tem alunos para conversar. Aceite uma solicitação primeiro."}
            </p>
          )}
          {contacts.map((c) => (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className={`chat-contact ${c.id === partnerId ? "is-active" : ""}`}
            >
              <strong>{c.name}</strong>
              <span>{c.last ? c.last.text : c.subtitle}</span>
            </Link>
          ))}
        </aside>

        <section className="chat-thread">
          {!partner ? (
            <div className="chat-placeholder">Selecione uma conversa para começar.</div>
          ) : (
            <>
              <header className="chat-thread-header">
                <button
                  type="button"
                  className="chat-back"
                  onClick={() => navigate("/chat")}
                  aria-label="Voltar para as conversas"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <strong>{partner.name}</strong>
                  <span>{partner.subtitle}</span>
                </div>
              </header>

              <div className="chat-messages">
                {messages.length === 0 && (
                  <p className="chat-empty">Nenhuma mensagem ainda. Diga olá!</p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`chat-bubble ${m.from.id === session.userId ? "is-mine" : ""}`}
                  >
                    <p>{m.text}</p>
                    <span>{time(m.sentAt)}</span>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form className="chat-form" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Mensagem"
                />
                <button type="submit" className="prof-btn prof-btn-primary" disabled={!text.trim()}>
                  <Send size={16} /> Enviar
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Chat;
