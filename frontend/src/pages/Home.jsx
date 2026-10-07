import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, Clock, MapPin, GraduationCap } from "lucide-react";
import { getSession } from "../services/session";
import { listAppointments } from "../services/appointmentsApi";
import { listWorkoutsOf } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { toDate, dateParts } from "../utils/appointmentDate";
import "../styles/Home.css";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Confirmado",
};

function Home() {
  const session = getSession();
  const firstName = session.name?.split(" ")[0] ?? "";

  const [nextAppointment, setNextAppointment] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listAppointments(), listWorkoutsOf(session.userId)])
      .then(([appointments, myWorkouts]) => {
        const now = new Date();
        const upcoming = appointments
          .filter((a) => !a.studentId || a.studentId === session.userId)
          .filter(
            (a) =>
              ["pending", "confirmed"].includes(a.status) && toDate(a) >= now
          )
          .sort((a, b) => toDate(a) - toDate(b));

        setNextAppointment(upcoming[0] ?? null);
        setWorkouts(myWorkouts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session.userId]);

  const lastWorkout = workouts[0];
  const parts = nextAppointment ? dateParts(nextAppointment) : null;

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Olá, {firstName}!</h1>
        <p>
          Bem-vindo ao UniFit!
          {session.level && (
            <span className="home-level">{levelLabel(session.level)}</span>
          )}
        </p>
      </header>

      {!loading && (
        <div className="home-grid">
          {/* próxima aula */}
          <section className="home-card">
            <div className="home-card-title">
              <CalendarDays size={18} />
              <h2>Próxima aula</h2>
            </div>

            {nextAppointment ? (
              <div className="home-appointment">
                <div className="home-date" aria-hidden="true">
                  <strong>{parts.day}</strong>
                  <span>{parts.month}</span>
                </div>
                <div className="home-appointment-info">
                  <h3>
                    {nextAppointment.type}
                    <span
                      className={`home-badge home-badge-${nextAppointment.status}`}
                    >
                      {STATUS_LABEL[nextAppointment.status]}
                    </span>
                  </h3>
                  <p>
                    <GraduationCap size={14} /> {nextAppointment.professorName}
                  </p>
                  <p>
                    <Clock size={14} />
                    <span className="home-weekday">{parts.weekday}</span> às{" "}
                    {nextAppointment.time}
                  </p>
                  <p>
                    <MapPin size={14} /> {nextAppointment.gym}
                  </p>
                </div>
              </div>
            ) : (
              <p className="home-empty">Você não tem aulas agendadas.</p>
            )}

            <Link
              to={nextAppointment ? "/agenda" : "/professores"}
              className="home-link"
            >
              {nextAppointment ? "Ver agenda" : "Agendar com um professor"}
            </Link>
          </section>

          {/* fichas */}
          <section className="home-card">
            <div className="home-card-title">
              <ClipboardList size={18} />
              <h2>Minhas fichas</h2>
            </div>

            {lastWorkout ? (
              <>
                <p className="home-count">
                  <strong>{workouts.length}</strong>{" "}
                  {workouts.length === 1 ? "ficha criada" : "fichas criadas"}
                </p>
                <div className="home-workout">
                  <span className="home-workout-label">Mais recente</span>
                  <h3>{lastWorkout.name}</h3>
                  <p>
                    {lastWorkout.exercises?.length ?? 0}{" "}
                    {(lastWorkout.exercises?.length ?? 0) === 1
                      ? "exercício"
                      : "exercícios"}
                    {lastWorkout.goal ? ` · ${lastWorkout.goal}` : ""}
                  </p>
                </div>
                <Link to={`/fichas/${lastWorkout.id}`} className="home-link">
                  Abrir ficha
                </Link>
              </>
            ) : (
              <>
                <p className="home-empty">Você ainda não tem fichas de treino.</p>
                <Link to="/fichas/nova" className="home-link">
                  Criar minha primeira ficha
                </Link>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;