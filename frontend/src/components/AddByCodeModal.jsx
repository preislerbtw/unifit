import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  MODAL_OVERLAY,
  MODAL_CARD,
  MODAL_CLOSE,
  MODAL_SUBTITLE,
  MODAL_FIELD,
  MODAL_FIELD_LABEL,
  MODAL_FIELD_INPUT,
  MODAL_ERROR,
  MODAL_ACTIONS,
  PROF_BTN,
  PROF_BTN_PRIMARY,
  PROF_BTN_SECONDARY,
} from "../styles/professorsClasses";

// janela para adicionar alguém pelo código de 4 dígitos (aluno -> professor e professor -> aluno).
// onConfirm(codigo) deve lançar erro com a mensagem para mostrar
function AddByCodeModal({ title, subtitle, onClose, onConfirm }) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // fecha com a tecla Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{4}$/.test(codigo)) {
      setErro("O código tem 4 números.");
      return;
    }

    setEnviando(true);
    try {
      await onConfirm(codigo);
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={MODAL_CARD}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={MODAL_CLOSE} onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h2 id="modal-titulo">{title}</h2>
        <p className={MODAL_SUBTITLE}>{subtitle}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={MODAL_FIELD}>
            <label htmlFor="prof-codigo" className={MODAL_FIELD_LABEL}>Código</label>
            <input
              id="prof-codigo"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              maxLength={4}
              placeholder="0000"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.replace(/\D/g, ""));
                setErro("");
              }}
              className={MODAL_FIELD_INPUT}
            />
          </div>

          {erro && <p className={MODAL_ERROR}>{erro}</p>}

          <div className={MODAL_ACTIONS}>
            <button type="button" className={`${PROF_BTN} ${PROF_BTN_SECONDARY}`} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${PROF_BTN} ${PROF_BTN_PRIMARY}`} disabled={enviando}>
              {enviando ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddByCodeModal;
