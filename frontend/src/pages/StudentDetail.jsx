import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import WorkoutCard from "../components/WorkoutCard";
import { getSession } from "../services/session";
import { getStudentOfProfessor } from "../services/studentsApi";
import { listWorkoutsOf, deleteWorkout } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { PROF_BTN, PROF_BTN_PRIMARY, PROF_BTN_SECONDARY, PROF_NOTICE } from "../styles/professorsClasses";
import {
  WORKOUTS_PAGE,
  WORKOUTS_BACK,
  WORKOUTS_HEADER,
  WORKOUTS_SUBTITLE,
  WORKOUTS_EMPTY,
  WORKOUTS_LIST,
  STUDENT_HEADER_ACTIONS,
  FLEX_NONE_NO_UNDERLINE,
} from "../styles/workoutsClasses";

// fichas de um aluno, vistas pelo professor
function StudentDetail() {
  const { studentId } = useParams();
  const location = useLocation();
  const [session] = useState(getSession);
  const [student, setStudent] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(location.state?.notice ?? "");

  useEffect(() => {
    Promise.all([getStudentOfProfessor(session, studentId), listWorkoutsOf(studentId)])
      .then(([s, w]) => {
        setStudent(s);
        // o professor vê as fichas que criou (o admin vê todas)
        setWorkouts(
          w.filter((x) => session.role === "admin" || x.createdBy?.id === session.userId)
        );
      })
      .finally(() => setLoading(false));
  }, [session, studentId]);

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

  if (loading) return <p className={WORKOUTS_PAGE}>Carregando...</p>;

  if (!student) {
    return (
      <div className={WORKOUTS_PAGE}>
        <Link to="/alunos" className={WORKOUTS_BACK}>
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className={WORKOUTS_EMPTY}>Aluno não encontrado entre os seus atendimentos.</div>
      </div>
    );
  }

  return (
    <div className={WORKOUTS_PAGE}>
      <Link to="/alunos" className={WORKOUTS_BACK}>
        <ArrowLeft size={16} /> Alunos
      </Link>

      <div className={WORKOUTS_HEADER}>
        <div>
          <h1>{student.name}</h1>
          <p className={WORKOUTS_SUBTITLE}>Nível: {levelLabel(student.level)}</p>
        </div>
        <div className={STUDENT_HEADER_ACTIONS}>
          {session.role === "professor" && (
            <Link
              to={`/chat/${student.id}`}
              className={`${PROF_BTN} ${PROF_BTN_SECONDARY} ${FLEX_NONE_NO_UNDERLINE}`}
            >
              Conversar
            </Link>
          )}
          <Link
            to={`/alunos/${student.id}/fichas/nova`}
            className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${FLEX_NONE_NO_UNDERLINE}`}
          >
            <Plus size={16} /> Nova ficha
          </Link>
        </div>
      </div>

      {notice && (
        <p className={PROF_NOTICE} role="status">
          {notice}
        </p>
      )}

      {workouts.length === 0 && (
        <div className={WORKOUTS_EMPTY}>
          <p>Você ainda não criou fichas para {student.name}.</p>
          <Link
            to={`/alunos/${student.id}/fichas/nova`}
            className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${FLEX_NONE_NO_UNDERLINE}`}
          >
            Criar a primeira ficha
          </Link>
        </div>
      )}

      <div className={WORKOUTS_LIST}>
        {workouts.map((w) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            to={`/alunos/${student.id}/fichas/${w.id}`}
            currentUserId={session.userId}
            canDelete
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default StudentDetail;
