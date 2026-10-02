import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h2 id="modal-titulo">Agendamento</h2>
        <p className="modal-subtitle">com {professor.nome}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label htmlFor="ag-tipo">Tipo</label>
            <select id="ag-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label htmlFor="ag-data">Data</label>
            <input
              id="ag-data"
              type="date"
              min={hoje}
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setErro("");
              }}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="ag-horario">Horário</label>
            <select
              id="ag-horario"
              value={horario}
              onChange={(e) => {
                setHorario(e.target.value);
                setErro("");
              }}
            >
              <option value="">Selecione</option>
              {HORARIOS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>

          {erro && <p className="modal-error">{erro}</p>}

          <div className="modal-actions">
            <button type="button" className="prof-btn prof-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="prof-btn prof-btn-primary">
              Confirmar agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentModal;