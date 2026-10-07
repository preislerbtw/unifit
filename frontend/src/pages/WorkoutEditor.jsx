import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import ExercisePicker from "../components/ExercisePicker";
import { getSession } from "../services/session";
import { getStudentOfProfessor } from "../services/studentsApi";
import { getWorkout, saveWorkout, makeLine } from "../services/workoutsApi";
import { levelLabel, levelRank } from "../utils/levels";
import "../styles/Professors.css"; // botões
import "../styles/Workouts.css";

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

  if (loading) return <p className="workouts-page">Carregando ficha...</p>;

  const title = readOnly ? "Ficha" : workout ? "Editar ficha" : "Nova ficha";

  return (
    <div className="workouts-page">
      <Link to={backTo} className="workouts-back">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <h1>{title}</h1>
      <p className="workouts-subtitle">
        {isStaff ? `Aluno: ${owner.name}` : `Para: ${owner.name}`}
        {owner.level && <> · Nível: {levelLabel(owner.level)}</>}
      </p>

      {readOnly && (
        <p className="professors-notice">
          Esta ficha foi criada por {workout.createdBy?.name}. Você pode consultá-la, mas
          não editá-la.
        </p>
      )}

      <form onSubmit={handleSave} noValidate className="editor-form">
        <div className="editor-fields">
          <div className="modal-field">
            <label htmlFor="w-name">Nome da ficha</label>
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
            />
          </div>
          <div className="modal-field">
            <label htmlFor="w-goal">Objetivo (opcional)</label>
            <input
              id="w-goal"
              type="text"
              placeholder="Ex: Hipertrofia"
              value={goal}
              disabled={readOnly}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        </div>

        <h2 className="editor-section">Exercícios</h2>

        {lines.length === 0 && (
          <div className="workouts-empty">Nenhum exercício adicionado ainda.</div>
        )}

        <div className="editor-lines">
          {lines.map((l, index) => {
            const aboveLevel =
              owner.level && levelRank(l.difficulty) > levelRank(owner.level);
            return (
              <div key={l.lineId} className="editor-line">
                <div className="editor-line-name">
                  <strong>{l.name}</strong>
                  <span>
                    {levelLabel(l.difficulty)}
                    {aboveLevel && <em className="above-level"> · acima do nível do aluno</em>}
                  </span>
                </div>

                <label className="editor-num">
                  Séries
                  <input
                    type="number"
                    min="1"
                    value={l.sets}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "sets", e.target.value)}
                  />
                </label>
                <label className="editor-num">
                  Reps
                  <input
                    type="number"
                    min="1"
                    value={l.reps}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "reps", e.target.value)}
                  />
                </label>
                <label className="editor-num editor-load">
                  Carga
                  <input
                    type="text"
                    placeholder="40 kg"
                    value={l.load}
                    disabled={readOnly}
                    onChange={(e) => updateLine(l.lineId, "load", e.target.value)}
                  />
                </label>

                {!readOnly && (
                  <div className="editor-line-actions">
                    <button type="button" onClick={() => moveLine(index, -1)} disabled={index === 0} aria-label="Subir">
                      <ChevronUp size={16} />
                    </button>
                    <button type="button" onClick={() => moveLine(index, 1)} disabled={index === lines.length - 1} aria-label="Descer">
                      <ChevronDown size={16} />
                    </button>
                    <button type="button" onClick={() => removeLine(l.lineId)} aria-label={`Remover ${l.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="modal-error">{error}</p>}

        {!readOnly && (
          <div className="editor-actions">
            <button type="button" className="prof-btn prof-btn-secondary" onClick={() => setPickerOpen(true)}>
              <Plus size={16} /> Adicionar exercício
            </button>
            <button type="submit" className="prof-btn prof-btn-primary" disabled={saving}>
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
