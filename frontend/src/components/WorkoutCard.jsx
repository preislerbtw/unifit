import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { levelLabel } from "../utils/levels";

// card de uma ficha (usado na lista do aluno e na página do aluno do professor)
function WorkoutCard({ workout, to, canDelete, onDelete, currentUserId }) {
  const created = new Date(workout.createdAt).toLocaleDateString("pt-BR");
  const mine = workout.createdBy?.id === currentUserId;

  return (
    <article className="workout-card">
      <div className="workout-card-main">
        <div className="workout-card-title">
          <h3>{workout.name}</h3>
          {!mine && <span className="workout-badge">Criada por {workout.createdBy?.name}</span>}
        </div>

        {workout.goal && <p className="workout-goal">{workout.goal}</p>}

        <p className="workout-meta">
          {workout.exercises.length}{" "}
          {workout.exercises.length === 1 ? "exercício" : "exercícios"} · criada em {created}
          {workout.ownerLevel && <> · nível {levelLabel(workout.ownerLevel).toLowerCase()}</>}
        </p>

        <ul className="workout-preview">
          {workout.exercises.slice(0, 3).map((l) => (
            <li key={l.lineId}>
              {l.name} · {l.sets}x{l.reps}
            </li>
          ))}
          {workout.exercises.length > 3 && <li>+ {workout.exercises.length - 3} exercícios</li>}
        </ul>
      </div>

      <div className="workout-card-actions">
        <Link to={to} className="prof-btn prof-btn-primary">
          {mine ? "Abrir" : "Ver ficha"}
        </Link>
        {canDelete && (
          <button
            type="button"
            className="workout-delete"
            onClick={() => onDelete(workout)}
            aria-label={`Excluir ${workout.name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  );
}

export default WorkoutCard;
