import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { levelLabel } from "../utils/levels";
import { PROF_BTN, PROF_BTN_PRIMARY } from "../styles/professorsClasses";
import {
  WORKOUT_CARD,
  WORKOUT_CARD_MAIN,
  WORKOUT_CARD_TITLE,
  WORKOUT_CARD_TITLE_H3,
  WORKOUT_BADGE,
  WORKOUT_GOAL,
  WORKOUT_META,
  WORKOUT_PREVIEW,
  WORKOUT_CARD_ACTIONS,
  WORKOUT_DELETE,
  FLEX_NONE_NO_UNDERLINE,
} from "../styles/workoutsClasses";

// card de uma ficha (usado na lista do aluno e na página do aluno do professor)
function WorkoutCard({ workout, to, canDelete, onDelete, currentUserId }) {
  const created = new Date(workout.createdAt).toLocaleDateString("pt-BR");
  const mine = workout.createdBy?.id === currentUserId;

  return (
    <article className={WORKOUT_CARD}>
      <div className={WORKOUT_CARD_MAIN}>
        <div className={WORKOUT_CARD_TITLE}>
          <h3 className={WORKOUT_CARD_TITLE_H3}>{workout.name}</h3>
          {!mine && <span className={WORKOUT_BADGE}>Criada por {workout.createdBy?.name}</span>}
        </div>

        {workout.goal && <p className={WORKOUT_GOAL}>{workout.goal}</p>}

        <p className={WORKOUT_META}>
          {workout.exercises.length}{" "}
          {workout.exercises.length === 1 ? "exercício" : "exercícios"} · criada em {created}
          {workout.ownerLevel && <> · nível {levelLabel(workout.ownerLevel).toLowerCase()}</>}
        </p>

        <ul className={WORKOUT_PREVIEW}>
          {workout.exercises.slice(0, 3).map((l) => (
            <li key={l.lineId}>
              {l.name} · {l.sets}x{l.reps}
            </li>
          ))}
          {workout.exercises.length > 3 && <li>+ {workout.exercises.length - 3} exercícios</li>}
        </ul>
      </div>

      <div className={WORKOUT_CARD_ACTIONS}>
        <Link to={to} className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${FLEX_NONE_NO_UNDERLINE}`}>
          {mine ? "Abrir" : "Ver ficha"}
        </Link>
        {canDelete && (
          <button
            type="button"
            className={WORKOUT_DELETE}
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
