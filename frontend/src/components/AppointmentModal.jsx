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

const TIPOS = ["Avaliação física", "Aula"];
const HORARIOS = [
  "08:00", "09:00", "10:00", "11:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00",
];

function AppointmentModal({ professor, onClose, onConfirm }) {
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [erro, setErro] = useState("");

  // data de hoje no formato yyyy-mm-dd
  const hoje = new Date().toLocaleDateString("sv-SE");

  // fecha com a tecla Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!data || data < hoje) {
      setErro("Escolha uma data a partir de hoje.");
      return;
    }
    if (!horario) {
      setErro("Escolha um horário.");
      return;
    }

    onConfirm({ professorId: professor.id, tipo, data, horario });
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

        <h2 id="modal-titulo">Agendamento</h2>
        <p className={MODAL_SUBTITLE}>com {professor.nome}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={MODAL_FIELD}>
            <label htmlFor="ag-tipo" className={MODAL_FIELD_LABEL}>Tipo</label>
            <select
              id="ag-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={MODAL_FIELD_INPUT}
            >
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={MODAL_FIELD}>
            <label htmlFor="ag-data" className={MODAL_FIELD_LABEL}>Data</label>
            <input
              id="ag-data"
              type="date"
              min={hoje}
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setErro("");
              }}
              className={MODAL_FIELD_INPUT}
            />
          </div>

          <div className={MODAL_FIELD}>
            <label htmlFor="ag-horario" className={MODAL_FIELD_LABEL}>Horário</label>
            <select
              id="ag-horario"
              value={horario}
              onChange={(e) => {
                setHorario(e.target.value);
                setErro("");
              }}
              className={MODAL_FIELD_INPUT}
            >
              <option value="">Selecione</option>
              {HORARIOS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>

          {erro && <p className={MODAL_ERROR}>{erro}</p>}

          <div className={MODAL_ACTIONS}>
            <button type="button" className={`${PROF_BTN} ${PROF_BTN_SECONDARY}`} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${PROF_BTN} ${PROF_BTN_PRIMARY}`}>
              Confirmar agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentModal;
