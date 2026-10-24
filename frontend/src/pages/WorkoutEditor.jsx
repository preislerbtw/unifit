import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import ExercisePicker from "../components/ExercisePicker";
import { getSession } from "../services/session";
import { getStudentOfProfessor } from "../services/studentsApi";
import { getWorkout, saveWorkout, makeLine } from "../services/workoutsApi";
import { levelLabel, levelRank } from "../utils/levels";
import {
  PROF_BTN,
  PROF_BTN_PRIMARY,
  PROF_BTN_SECONDARY,
  PROF_NOTICE,
  MODAL_FIELD,
  MODAL_FIELD_LABEL,
  MODAL_FIELD_INPUT,
  MODAL_ERROR,
} from "../styles/professorsClasses";
import {
  WORKOUTS_PAGE,
  WORKOUTS_BACK,
  WORKOUTS_SUBTITLE,
  WORKOUTS_EMPTY,
  EDITOR_FORM,
  EDITOR_FIELDS,
  EDITOR_SECTION,
  EDITOR_LINES,
  EDITOR_LINE,
  EDITOR_LINE_NAME,
  EDITOR_LINE_NAME_SPAN,
  ABOVE_LEVEL,
  EDITOR_NUM,
  EDITOR_NUM_LOAD,
  INPUT_BOX,
  EDITOR_LINE_ACTIONS,
  EDITOR_LINE_ACTION_BTN,
  EDITOR_LINE_ACTION_BTN_DANGER,
  EDITOR_ACTIONS,
} from "../styles/workoutsClasses";

// Editor de fichas. Serve para os dois perfis:
// - aluno:     /fichas/nova  e  /fichas/:workoutId
// - professor: /alunos/:studentId/fichas/nova  e  /alunos/:studentId/fichas/:workoutId
function WorkoutEditor() {
  const { studentId, workoutId } = useParams();
  const navigate = useNavigate();
  const [session] = useState(getSession);

  const isStaff = session.role !== "aluno";
  const ownerId = isStaff ? studentId : session.userId;
  const backTo = isStaff ? `/alunos/${studentId}` : "/fichas";

  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  const [owner, setOwner] = useState({ name: "", level: undefined });
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [lines, setLines] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (workoutId) {
        const w = await getWorkout(workoutId);
        if (cancelled) return;
        // ficha inexistente ou de outro aluno: volta para a lista
        if (!w || w.ownerId !== ownerId) {
          navigate(backTo, { replace: true });
          return;
        }
        setWorkout(w);
        setName(w.name);
        setGoal(w.goal ?? "");
        setLines(w.exercises);
        setOwner({ name: w.ownerName, level: w.ownerLevel });
      } else if (isStaff) {
        const student = await getStudentOfProfessor(session, studentId);
        if (cancelled) return;
        if (!student) {
          navigate(backTo, { replace: true });
          return;
        }
        setOwner({ name: student.name, level: student.level });
      } else {
        setOwner({ name: session.name, level: session.level });
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workoutId, ownerId, isStaff, studentId, backTo, navigate, session]);

  // só quem criou a ficha pode editar
  const readOnly = Boolean(workout) && workout.createdBy?.id !== session.userId;

  function updateLine(lineId, field, value) {
    setLines((list) =>
      list.map((l) => (l.lineId === lineId ? { ...l, [field]: value } : l))
    );
  }

  function removeLine(lineId) {
    setLines((list) => list.filter((l) => l.lineId !== lineId));
  }

  function moveLine(index, delta) {
    setLines((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addExercise(exercise) {
    setLines((list) =>
      list.some((l) => l.exerciseId === exercise.id) ? list : [...list, makeLine(exercise)]
    );
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Dê um nome para a ficha.");
      return;
    }
    if (lines.length === 0) {
      setError("Adicione pelo menos um exercício.");
      return;
    }

    setSaving(true);
    await saveWorkout({
      ...(workout ?? {}),
      ownerId,
      ownerName: owner.name,
      ownerLevel: owner.level,
      name: name.trim(),
      goal: goal.trim(),
      createdBy:
        workout?.createdBy ?? { id: session.userId, role: session.role, name: session.name },
      exercises: lines.map((l) => ({
        ...l,
        sets: Math.max(1, Number(l.sets) || 1),
        reps: Math.max(1, Number(l.reps) || 1),
      })),
    });
    navigate(backTo, {
      state: { notice: workout ? "Ficha atualizada." : "Ficha criada." },
    });
  }

  if (loading) return <p className={WORKOUTS_PAGE}>Carregando ficha...</p>;

  const title = readOnly ? "Ficha" : workout ? "Editar ficha" : "Nova ficha";

  return (
    <div className={WORKOUTS_PAGE}>
      <Link to={backTo} className={WORKOUTS_BACK}>
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1>{title}</h1>
      <p className={WORKOUTS_SUBTITLE}>
        {isStaff ? `Aluno: ${owner.name}` : `Para: ${owner.name}`}
        {owner.level && <> · Nível: {levelLabel(owner.level)}</>}
      </p>

      {readOnly && (
        <p className={PROF_NOTICE}>
          Esta ficha foi criada por {workout.createdBy?.name}. Você pode consultá-la, mas
          não editá-la.
        </p>
      )}

      <form onSubmit={handleSave} noValidate className={EDITOR_FORM}>
        <div className={EDITOR_FIELDS}>
          <div className={MODAL_FIELD}>
            <label htmlFor="w-name" className={MODAL_FIELD_LABEL}>Nome da ficha</label>
            <input
              id="w-name"
              type="text"
              placeholder="Ex: Ficha A · Peito"
              value={name}
              disabled={readOnly}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className={MODAL_FIELD_INPUT}
            />
          </div>
          <div className={MODAL_FIELD}>
            <label htmlFor="w-goal" className={MODAL_FIELD_LABEL}>Objetivo (opcional)</label>
            <input
              id="w-goal"
              type="text"
              placeholder="Ex: Hipertrofia"
              value={goal}
              disabled={readOnly}
              onChange={(e) => setGoal(e.target.value)}
              className={MODAL_FIELD_INPUT}
            />
          </div>
        </div>

        <h2 className={EDITOR_SECTION}>Exercícios</h2>

        {lines.length === 0 && (
          <div className={WORKOUTS_EMPTY}>Nenhum exercício adicionado ainda.</div>
        )}

        <div className={EDITOR_LINES}>
          {lines.map((l, index) => {
            const aboveLevel =
              owner.level && levelRank(l.difficulty) > levelRank(owner.level);
            return (
              <div key={l.lineId} className={EDITOR_LINE}>
                <div className={EDITOR_LINE_NAME}>
                  <strong>{l.name}</strong>
                  <span className={EDITOR_LINE_NAME_SPAN}>
                    {levelLabel(l.difficulty)}
                    {aboveLevel && <em className={ABOVE_LEVEL}> · acima do nível do aluno</em>}
                  </span>
                </div>

                <label className={EDITOR_NUM}>
                  Séries
                  <input
                    type="number"
                    min="1"
                    value={l.sets}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "sets", e.target.value)}
                    className={INPUT_BOX}
                  />
                </label>
                <label className={EDITOR_NUM}>
                  Reps
                  <input
                    type="number"
                    min="1"
                    value={l.reps}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "reps", e.target.value)}
                    className={INPUT_BOX}
                  />
                </label>
                <label className={`${EDITOR_NUM} ${EDITOR_NUM_LOAD}`}>
                  Carga
                  <input
                    type="text"
                    placeholder="40 kg"
                    value={l.load}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "load", e.target.value)}
                    className={INPUT_BOX}
                  />
                </label>

                {!readOnly && (
                  <div className={EDITOR_LINE_ACTIONS}>
                    <button
                      type="button"
                      className={EDITOR_LINE_ACTION_BTN}
                      onClick={() => moveLine(index, -1)}
                      disabled={index === 0}
                      aria-label="Subir"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      className={EDITOR_LINE_ACTION_BTN}
                      onClick={() => moveLine(index, 1)}
                      disabled={index === lines.length - 1}
                      aria-label="Descer"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      className={`${EDITOR_LINE_ACTION_BTN} ${EDITOR_LINE_ACTION_BTN_DANGER}`}
                      onClick={() => removeLine(l.lineId)}
                      aria-label={`Remover ${l.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && <p className={MODAL_ERROR}>{error}</p>}

        {!readOnly && (
          <div className={EDITOR_ACTIONS}>
            <button
              type="button"
              className={`${PROF_BTN} ${PROF_BTN_SECONDARY} flex-none`}
              onClick={() => setPickerOpen(true)}
            >
              <Plus size={16} /> Adicionar exercício
            </button>
            <button type="submit" className={`${PROF_BTN} ${PROF_BTN_PRIMARY} flex-none`} disabled={saving}>
              Salvar ficha
            </button>
          </div>
        )}
      </form>

      {pickerOpen && (
        <ExercisePicker
          studentLevel={isStaff ? owner.level : undefined}
          existingIds={lines.map((l) => l.exerciseId)}
          onAdd={addExercise}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default WorkoutEditor;
