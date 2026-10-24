import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getPopularExercises, searchCatalog } from "../services/catalogApi";
import { levelLabel, levelRank } from "../utils/levels";
import { trBodyPart, trEquipment } from "../utils/translations";
import {
  MODAL_OVERLAY,
  MODAL_CARD,
  MODAL_CLOSE,
  MODAL_FIELD,
  MODAL_FIELD_LABEL,
  MODAL_FIELD_INPUT,
  MODAL_ERROR,
  MODAL_ACTIONS,
  PROF_BTN,
  PROF_BTN_PRIMARY,
  PROF_BTN_SECONDARY,
} from "../styles/professorsClasses";
import {
  PICKER_CARD,
  PICKER_SEARCH,
  PICKER_SEARCH_INPUT,
  PICKER_STATUS,
  PICKER_LIST,
  PICKER_ITEM,
  PICKER_ITEM_INFO,
  PICKER_ITEM_SPAN,
  PICKER_ITEM_BTN_EXTRA,
} from "../styles/workoutsClasses";

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
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={`${MODAL_CARD} ${PICKER_CARD}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={MODAL_CLOSE} onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h2 id="picker-title">Adicionar exercício</h2>

        <div className={PICKER_SEARCH}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar pelo nome (ex: supino, agachamento)"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
            className={PICKER_SEARCH_INPUT}
          />
        </div>

        {studentLevel && (
          <div className={MODAL_FIELD}>
            <label htmlFor="picker-level" className={MODAL_FIELD_LABEL}>Nível dos exercícios</label>
            <select
              id="picker-level"
              value={levelMode}
              onChange={(e) => setLevelMode(e.target.value)}
              className={MODAL_FIELD_INPUT}
            >
              <option value="fit">
                Adequados ao aluno (até {levelLabel(studentLevel)})
              </option>
              <option value="all">Todos os níveis</option>
            </select>
          </div>
        )}

        {error && <p className={MODAL_ERROR}>{error}</p>}
        {loading && <p className={PICKER_STATUS}>Carregando...</p>}
        {!loading && list.length === 0 && !error && (
          <p className={PICKER_STATUS}>Nenhum exercício encontrado.</p>
        )}

        <ul className={PICKER_LIST}>
          {list.map((ex) => {
            const added = existingIds.includes(ex.id);
            return (
              <li key={ex.id} className={PICKER_ITEM}>
                <div className={PICKER_ITEM_INFO}>
                  <strong>{ex.name}</strong>
                  <span className={PICKER_ITEM_SPAN}>
                    {trBodyPart(ex.bodyPart)} · {trEquipment(ex.equipment)} ·{" "}
                    {levelLabel(ex.difficulty)}
                  </span>
                </div>
                <button
                  type="button"
                  className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${PICKER_ITEM_BTN_EXTRA}`}
                  disabled={added}
                  onClick={() => onAdd(ex)}
                >
                  {added ? "Na ficha" : "Adicionar"}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={MODAL_ACTIONS}>
          <button type="button" className={`${PROF_BTN} ${PROF_BTN_SECONDARY}`} onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExercisePicker;
