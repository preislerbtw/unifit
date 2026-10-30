import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { getSession } from "../services/session";
import { sendAiMessage } from "../services/chatApi";
import { PROF_BTN, PROF_BTN_PRIMARY } from "../styles/professorsClasses";

const AI_ID = "ia";

function time(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// mantém a conversa enquanto a aba do navegador estiver aberta
function loadHistory(key) {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// chat com o assistente de IA da unifit
function ChatIA() {
  const [session] = useState(getSession);
  const storageKey = `unifit-chat-ia-${session.userId}`;

  const [messages, setMessages] = useState(() => loadHistory(storageKey));
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // sem armazenamento disponível: a conversa só dura enquanto a página estiver aberta
    }
  }, [messages, storageKey]);

  // rola para a última mensagem
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages.length, loading]);

  async function handleSend(e) {
    e.preventDefault();
    const content = text.trim();
    if (!content || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      text: content,
      sentAt: new Date().toISOString(),
      from: { id: session.userId },
    };
    const history = [...messages, userMsg];

    setMessages(history);
    setText("");
    setLoading(true);

    try {
      const resposta = await sendAiMessage(
        history.map((m) => ({
          role: m.from.id === AI_ID ? "assistant" : "user",
          content: m.text,
        })),
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          text: resposta,
          sentAt: new Date().toISOString(),
          from: { id: AI_ID },
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          text: "Não consegui responder agora. Tente novamente em instantes.",
          sentAt: new Date().toISOString(),
          from: { id: AI_ID },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen box-border px-10 pt-7 pb-6 bg-[var(--bg-page)] text-[var(--text)] max-md:px-4 max-md:pt-[72px] max-md:pb-4">
      <h1 className="mb-4">Assistente IA</h1>

      <div className="flex-1 min-h-0 flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] overflow-hidden">
        <header className="flex flex-col px-[18px] py-3.5 border-b border-[var(--border-subtle)]">
          <strong>Assistente UniFit (IA)</strong>
          <span className="text-[13px] text-[var(--text-muted)]">
            Tire dúvidas sobre treino e exercícios
          </span>
        </header>

        <div className="flex-1 min-h-0 flex flex-col gap-2 p-[18px] overflow-y-auto">
          {messages.length === 0 && (
            <p className="p-6 text-center text-sm text-[var(--text-muted)]">
              Pergunte qualquer coisa sobre exercícios e treino.
            </p>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[70%] px-3 py-2 max-md:max-w-[85%] ${
                m.from.id === AI_ID
                  ? "self-start rounded-[14px_14px_14px_4px] bg-[var(--bg-muted)] text-[var(--text)]"
                  : "self-end rounded-[14px_14px_4px_14px] bg-[var(--primary)] text-[var(--text-on-primary)]"
              }`}
            >
              <p className="[overflow-wrap:anywhere] whitespace-pre-wrap text-sm">{m.text}</p>
              <span className="block mt-0.5 text-[11px] opacity-70 text-right">{time(m.sentAt)}</span>
            </div>
          ))}
          {loading && (
            <div className="self-start max-w-[70%] px-3 py-2 rounded-[14px_14px_14px_4px] bg-[var(--bg-muted)] text-[var(--text-muted)] text-sm">
              Digitando...
            </div>
          )}
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
            disabled={!text.trim() || loading}
          >
            <Send size={16} /> Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatIA;