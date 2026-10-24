import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getSession } from "../services/session";
import {listWorkoutsOf, saveWorkout, makeLine,} from "../services/workoutsApi";
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
import { ADD_ROW } from "../styles/workoutsClasses";

function AddToWorkoutModal({ exercise, onClose, onDone }) {
  const session = getSession();
  const [mine, setMine] = useState([]); // fichas que o aluno pode editar
  const [target, setTarget] = useState("new");
  const [newName, setNewName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [load, setLoad] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    listWorkoutsOf(session.userId).then((list) => {
      const editable = list.filter((w) => w.createdBy?.id === session.userId);
      setMine(editable);
      if (editable.length > 0) setTarget(editable[0].id);
    });
  }, [session.userId]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();

    const line = makeLine(exercise, {
      sets: Math.max(1, Number(sets) || 1),
      reps: Math.max(1, Number(reps) || 1),
      load: load.trim(),
    });

    if (target === "new") {
      if (!newName.trim()) {
        setError("Dê um nome para a nova ficha.");
        return;
      }
      await saveWorkout({
        ownerId: session.userId,
        ownerName: session.name,
        ownerLevel: session.level,
        name: newName.trim(),
        goal: "",
        createdBy: { id: session.userId, role: session.role, name: session.name },
        exercises: [line],
      });
      onDone(`Exercício adicionado à nova ficha "${newName.trim()}".`);
      return;
    }

    const workout = mine.find((w) => w.id === target);
    if (workout.exercises.some((l) => l.exerciseId === exercise.id)) {
      setError("Este exercício já está nessa ficha.");
      return;
    }
    await saveWorkout({ ...workout, exercises: [...workout.exercises, line] });
    onDone(`Exercício adicionado à ficha "${workout.name}".`);
  }

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={MODAL_CARD}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={MODAL_CLOSE} onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h2 id="add-title">Adicionar à ficha</h2>
        <p className={MODAL_SUBTITLE}>{exercise.name}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={MODAL_FIELD}>
            <label htmlFor="add-target" className={MODAL_FIELD_LABEL}>Ficha</label>
            <select
              id="add-target"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setError("");
              }}
              className={MODAL_FIELD_INPUT}
            >
              {mine.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
              <option value="new">+ Nova ficha</option>
            </select>
          </div>

          {target === "new" && (
            <div className={MODAL_FIELD}>
              <label htmlFor="add-name" className={MODAL_FIELD_LABEL}>Nome da nova ficha</label>
              <input
                id="add-name"
                type="text"
                placeholder="Ex: Ficha A · Peito"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError("");
                }}
                className={MODAL_FIELD_INPUT}
              />
            </div>
          )}

          <div className={ADD_ROW}>
            <div className={MODAL_FIELD}>
              <label htmlFor="add-sets" className={MODAL_FIELD_LABEL}>Séries</label>
              <input
                id="add-sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className={MODAL_FIELD_INPUT}
              />
            </div>
            <div className={MODAL_FIELD}>
              <label htmlFor="add-reps" className={MODAL_FIELD_LABEL}>Repetições</label>
              <input
                id="add-reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={MODAL_FIELD_INPUT}
              />
            </div>
            <div className={MODAL_FIELD}>
              <label htmlFor="add-load" className={MODAL_FIELD_LABEL}>Carga</label>
              <input
                id="add-load"
                type="text"
                placeholder="40 kg"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className={MODAL_FIELD_INPUT}
              />
            </div>
          </div>

          {error && <p className={MODAL_ERROR}>{error}</p>}

          <div className={MODAL_ACTIONS}>
            <button type="button" className={`${PROF_BTN} ${PROF_BTN_SECONDARY}`} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`${PROF_BTN} ${PROF_BTN_PRIMARY}`}>
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddToWorkoutModal;
