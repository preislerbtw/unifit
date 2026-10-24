import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import WorkoutCard from "../components/WorkoutCard";
import { getSession } from "../services/session";
import { listWorkoutsOf, deleteWorkout } from "../services/workoutsApi";
import { PROF_BTN, PROF_BTN_PRIMARY, PROF_NOTICE } from "../styles/professorsClasses";
import {
  WORKOUTS_PAGE,
  WORKOUTS_HEADER,
  WORKOUTS_SUBTITLE,
  WORKOUTS_EMPTY,
  WORKOUTS_LIST,
  FLEX_NONE_NO_UNDERLINE,
} from "../styles/workoutsClasses";

// "Minhas fichas" do aluno
function Workouts() {
  const location = useLocation();
  const [session] = useState(getSession);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(location.state?.notice ?? "");

  useEffect(() => {
    listWorkoutsOf(session.userId)
      .then(setWorkouts)
      .finally(() => setLoading(false));
  }, [session.userId]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  async function handleDelete(workout) {
    if (!window.confirm(`Excluir a ficha "${workout.name}"?`)) return;
    await deleteWorkout(workout.id);
    setWorkouts((list) => list.filter((w) => w.id !== workout.id));
    setNotice("Ficha excluída.");
  }

  return (
    <div className={WORKOUTS_PAGE}>
      <div className={WORKOUTS_HEADER}>
        <div>
          <h1 className="mb-1">Minhas fichas</h1>
          <p className={`${WORKOUTS_SUBTITLE} mb-0`}>
            Monte suas fichas de treino ou veja as que seu professor criou para você.
          </p>
        </div>
        <Link
          to="/fichas/nova"
          className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${FLEX_NONE_NO_UNDERLINE}`}
        >
          <Plus size={16} /> Nova ficha
        </Link>
      </div>

      {notice && (
        <p className={PROF_NOTICE} role="status">
          {notice}
        </p>
      )}

      {loading && <p>Carregando fichas...</p>}

      {!loading && workouts.length === 0 && (
        <div className={WORKOUTS_EMPTY}>
          <p>Você ainda não tem nenhuma ficha.</p>
          <Link to="/fichas/nova" className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${FLEX_NONE_NO_UNDERLINE}`}>
            Criar minha primeira ficha
          </Link>
        </div>
      )}

      <div className={WORKOUTS_LIST}>
        {workouts.map((w) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            to={`/fichas/${w.id}`}
            currentUserId={session.userId}
            canDelete={w.createdBy?.id === session.userId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Workouts;
