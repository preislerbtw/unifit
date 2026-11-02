import { useEffect } from "react";
import { Users, Dumbbell, ShieldAlert } from "lucide-react";
import {
  MODAL_OVERLAY,
  MODAL_CARD,
  PROF_BTN,
  PROF_BTN_PRIMARY,
} from "../styles/professorsClasses";

// aviso mostrado uma única vez, logo depois que a conta é criada.
// Só fecha pelo botão: a pessoa precisa ler e confirmar.
function WelcomeNoticeModal({ nome, onConfirm }) {
  // Esc também confirma (Enter já aciona o botão, que recebe o foco)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onConfirm();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onConfirm]);

  const primeiroNome = nome.trim().split(/\s+/)[0];

  return (
    <div className={MODAL_OVERLAY}>
      <div
        className={`${MODAL_CARD} max-w-[480px] max-h-[90vh] overflow-y-auto`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aviso-titulo"
        aria-describedby="aviso-texto"
      >
        <h2 id="aviso-titulo" className="mb-1">
          Bem-vindo(a) ao UniFit, {primeiroNome}!
        </h2>
        <p className="mb-5 text-sm text-[var(--text-muted)]">Sua conta foi criada. Antes de começar:</p>

        <div id="aviso-texto" className="flex flex-col gap-4 text-sm">
          <div className="flex gap-3">
            <Users size={20} className="shrink-0 mt-0.5 text-[var(--text-primary-strong)]" />
            <p>
              <strong>Acompanhamento de professores.</strong> Você pode se conectar a um professor
              da academia pelo código dele, na aba <em>Professores</em>. Ele pode montar suas
              fichas e conversar com você pelo chat para ajudar no seu treino.
            </p>
          </div>

          <div className="flex gap-3">
            <Dumbbell size={20} className="shrink-0 mt-0.5 text-[var(--text-primary-strong)]" />
            <p>
              <strong>É opcional.</strong> Você pode usar o UniFit normalmente sem um professor:
              montar suas próprias fichas, consultar os exercícios e usar o assistente.
            </p>
          </div>

          <div className="flex gap-3 p-3.5 rounded-[10px] bg-[var(--bg-warning)] text-[var(--text-warning)]">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <p>
              <strong>Importante:</strong> ao treinar sem o acompanhamento de um professor, você é
              responsável pela forma como executa os exercícios. O UniFit não se responsabiliza
              por acidentes ou lesões que aconteçam durante os treinos.
            </p>
          </div>
        </div>

        <button
          type="button"
          autoFocus
          className={`${PROF_BTN} ${PROF_BTN_PRIMARY} w-full mt-6`}
          onClick={onConfirm}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

export default WelcomeNoticeModal;
