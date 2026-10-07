import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import WorkoutCard from "../components/WorkoutCard";
import { getSession } from "../services/session";
import { listWorkoutsOf, deleteWorkout } from "../services/workoutsApi";
import "../styles/Professors.css"; // botões
import "../styles/Workouts.css";

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
    <div className="workouts-page">
      <div className="workouts-header">
        <div>
          <h1>Minhas fichas</h1>
          <p className="workouts-subtitle">
            Monte suas fichas de treino ou veja as que seu professor criou para você.
          </p>
        </div>
        <Link to="/fichas/nova" className="prof-btn prof-btn-primary workouts-new">
          <Plus size={16} /> Nova ficha
        </Link>
      </div>

      {notice && (
        <p className="professors-notice" role="status">
          {notice}
        </p>
      )}

      {loading && <p>Carregando fichas...</p>}

      {!loading && workouts.length === 0 && (
        <div className="workouts-empty">
          <p>Você ainda não tem nenhuma ficha.</p>
          <Link to="/fichas/nova" className="prof-btn prof-btn-primary">
            Criar minha primeira ficha
          </Link>
        </div>
      )}

      <div className="workouts-list">
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
