import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getPopularExercises, searchCatalog } from "../services/catalogApi";
import { levelLabel, levelRank } from "../utils/levels";
import { trBodyPart, trEquipment } from "../utils/translations";
import "../styles/Professors.css"; // usa o modal e os botões desta folha
import "../styles/Workouts.css";

// Seletor de exercícios para montar fichas.
// studentLevel: nível do aluno (para sugerir só exercícios adequados)
function ExercisePicker({ studentLevel, existingIds, onAdd, onClose }) {
  const [term, setTerm] = useState("");
  const [popular, setPopular] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [levelMode, setLevelMode] = useState(studentLevel ? "fit" : "all");

  // exercícios populares ao abrir
  useEffect(() => {
    getPopularExercises()
      .then(setPopular)
      .catch(() => setError("Não foi possível carregar os exercícios."))
      .finally(() => setLoading(false));
  }, []);

  // busca livre (espera o usuário parar de digitar)
  useEffect(() => {
    if (!term.trim()) {
      setFound([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      searchCatalog(term)
        .then((list) => {
          setFound(list);
          setError("");
        })
        .catch(() => setError("Não foi possível buscar agora."))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(t);
  }, [term]);

  // fecha com Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const base = term.trim() ? found : popular;
  const list = base
    .filter(
      (ex) =>
        levelMode === "all" ||
        !studentLevel ||
        levelRank(ex.difficulty) <= levelRank(studentLevel)
    )
    .slice(0, 40);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card picker-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h2 id="picker-title">Adicionar exercício</h2>

        <div className="picker-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar pelo nome (ex: supino, agachamento)"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
          />
        </div>

        {studentLevel && (
          <div className="modal-field">
            <label htmlFor="picker-level">Nível dos exercícios</label>
            <select
              id="picker-level"
              value={levelMode}
              onChange={(e) => setLevelMode(e.target.value)}
            >
              <option value="fit">
                Adequados ao aluno (até {levelLabel(studentLevel)})
              </option>
              <option value="all">Todos os níveis</option>
            </select>
          </div>
        )}

        {error && <p className="modal-error">{error}</p>}
        {loading && <p className="picker-status">Carregando...</p>}
        {!loading && list.length === 0 && !error && (
          <p className="picker-status">Nenhum exercício encontrado.</p>
        )}

        <ul className="picker-list">
          {list.map((ex) => {
            const added = existingIds.includes(ex.id);
            return (
              <li key={ex.id} className="picker-item">
                <div>
                  <strong>{ex.name}</strong>
                  <span>
                    {trBodyPart(ex.bodyPart)} · {trEquipment(ex.equipment)} ·{" "}
                    {levelLabel(ex.difficulty)}
                  </span>
                </div>
                <button
                  type="button"
                  className="prof-btn prof-btn-primary"
                  disabled={added}
                  onClick={() => onAdd(ex)}
                >
                  {added ? "Na ficha" : "Adicionar"}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="modal-actions">
          <button type="button" className="prof-btn prof-btn-secondary" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExercisePicker;
