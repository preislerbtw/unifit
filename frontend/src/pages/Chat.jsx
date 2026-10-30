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
import { PROF_BTN, PROF_BTN_PRIMARY } from "../styles/professorsClasses";

function time(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// chat entre aluno e professor
// aluno - conversa com qualquer professor 
// professor - conversa com seus alunos
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
          })),
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
          })),
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
    const convsData = await listConversationsOf(session.userId);

    console.log("CONVS DATA:", convsData);

    setConvs(Array.isArray(convsData) ? convsData : []);

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
        : { student: { id: partner.id, name: partner.name }, professor: me },
    );
    await sendMessage(convId, { ...me, role: session.role }, content);
    setText("");
  }

  const hasThread = Boolean(partnerId);

  return (
    <div className="flex-1 flex flex-col h-screen box-border px-10 pt-7 pb-6 bg-[var(--bg-page)] text-[var(--text)] max-md:px-4 max-md:pt-[72px] max-md:pb-4">
      <h1 className="mb-4">Chat</h1>

      <div className="flex-1 min-h-0 grid grid-cols-[300px_1fr] max-md:grid-cols-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] overflow-hidden">
        <aside
          className={`flex flex-col overflow-y-auto border-r border-[var(--border-subtle)] ${
            hasThread ? "max-md:hidden" : ""
          }`}
          aria-label="Conversas"
        >
          {contacts.length === 0 && (
            <p className="p-6 text-center text-sm text-[var(--text-muted)]">
              {isStudent
                ? "Nenhum professor disponível."
                : "Você ainda não tem alunos para conversar. Aceite uma solicitação primeiro."}
            </p>
          )}
          {contacts.map((c) => (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className={`flex flex-col gap-0.5 px-4 py-3.5 border-b border-[var(--border-subtle)] text-[var(--text)] no-underline hover:bg-[var(--bg-hover)] ${
                c.id === partnerId ? "bg-[var(--bg-primary-soft)]" : ""
              }`}
            >
              <strong>{c.name}</strong>
              <span className="overflow-hidden text-[13px] text-[var(--text-muted)] text-ellipsis whitespace-nowrap">
                {c.last ? c.last.text : c.subtitle}
              </span>
            </Link>
          ))}
        </aside>

        <section className={`flex flex-col min-w-0 min-h-0 ${!hasThread ? "max-md:hidden" : ""}`}>
          {!partner ? (
            <div className="m-auto p-6 text-center text-sm text-[var(--text-muted)]">
              Selecione uma conversa para começar.
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 px-[18px] py-3.5 border-b border-[var(--border-subtle)]">
                <button
                  type="button"
                  className="hidden max-md:grid place-items-center w-[34px] h-[34px] border-none rounded-lg bg-[var(--bg-muted)] text-[var(--text)] cursor-pointer"
                  onClick={() => navigate("/chat")}
                  aria-label="Voltar para as conversas"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                  <strong>{partner.name}</strong>
                  <span className="text-[13px] text-[var(--text-muted)]">{partner.subtitle}</span>
                </div>
              </header>

              <div className="flex-1 min-h-0 flex flex-col gap-2 p-[18px] overflow-y-auto">
                {messages.length === 0 && (
                  <p className="p-6 text-center text-sm text-[var(--text-muted)]">
                    Nenhuma mensagem ainda. Diga olá!
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[70%] px-3 py-2 max-md:max-w-[85%] ${
                      m.from.id === session.userId
                        ? "self-end rounded-[14px_14px_4px_14px] bg-[var(--primary)] text-[var(--text-on-primary)]"
                        : "self-start rounded-[14px_14px_14px_4px] bg-[var(--bg-muted)] text-[var(--text)]"
                    }`}
                  >
                    <p className="[overflow-wrap:anywhere] whitespace-pre-wrap text-sm">{m.text}</p>
                    <span className="block mt-0.5 text-[11px] opacity-70 text-right">{time(m.sentAt)}</span>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form className="flex gap-2.5 px-4 py-3 border-t border-[var(--border-subtle)]" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Digite sua mensagem"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Mensagem"
                  className="flex-1 px-3.5 py-[11px] border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="submit"
                  className={`${PROF_BTN} ${PROF_BTN_PRIMARY} flex-none disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={!text.trim()}
                >
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