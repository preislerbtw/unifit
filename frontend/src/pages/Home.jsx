import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, Clock, MapPin, GraduationCap } from "lucide-react";
import { getSession } from "../services/session";
import { listAppointments } from "../services/appointmentsApi";
import { listWorkoutsOf } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { toDate, dateParts } from "../utils/appointmentDate";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Confirmado",
};

const BADGE_CLASS = {
  pending: "bg-[var(--bg-warning)] text-[var(--text-warning)]",
  confirmed: "bg-[var(--bg-success)] text-[var(--text-success)]",
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
    <div className="p-10 flex-1 text-[var(--text)]">
      <header>
        <h1 className="m-0 mb-1 text-[2rem]">Olá, {firstName}!</h1>
        <p className="m-0 flex items-center gap-2.5 text-[var(--text-muted)] text-[1.1rem]">
          Bem-vindo ao UniFit!
          {session.level && (
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-primary-soft)] text-[var(--text-primary-strong)] text-[0.8rem] font-semibold">
              {levelLabel(session.level)}
            </span>
          )}
        </p>
      </header>

      {!loading && (
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-5 mt-7 max-w-[900px]">
          {/* próxima aula */}
          <section className="flex flex-col gap-3.5 p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px]">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <CalendarDays size={18} />
              <h2 className="m-0 text-[1.05rem] text-[var(--text)]">Próxima aula</h2>
            </div>

            {nextAppointment ? (
              <div className="flex gap-3.5">
                <div
                  className="flex flex-col items-center justify-center min-w-[56px] h-16 rounded-[10px] bg-[var(--bg-primary-subtle)] text-[var(--text-primary)]"
                  aria-hidden="true"
                >
                  <strong className="text-[1.5rem] leading-none">{parts.day}</strong>
                  <span className="text-[0.8rem] uppercase">{parts.month}</span>
                </div>
                <div>
                  <h3 className="flex items-center flex-wrap gap-2 m-0 mb-1.5 text-base">
                    {nextAppointment.type}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.7rem] font-semibold ${BADGE_CLASS[nextAppointment.status]}`}
                    >
                      {STATUS_LABEL[nextAppointment.status]}
                    </span>
                  </h3>
                  <p className="flex items-center gap-1.5 my-0.5 text-[var(--text-secondary)] text-[0.9rem]">
                    <GraduationCap size={14} /> {nextAppointment.professorName}
                  </p>
                  <p className="flex items-center gap-1.5 my-0.5 text-[var(--text-secondary)] text-[0.9rem]">
                    <Clock size={14} />
                    <span className="capitalize">{parts.weekday}</span> às{" "}
                    {nextAppointment.time}
                  </p>
                  <p className="flex items-center gap-1.5 my-0.5 text-[var(--text-secondary)] text-[0.9rem]">
                    <MapPin size={14} /> {nextAppointment.gym}
                  </p>
                </div>
              </div>
            ) : (
              <p className="m-0 text-[var(--text-muted)]">Você não tem aulas agendadas.</p>
            )}

            <Link
              to={nextAppointment ? "/agenda" : "/professores"}
              className="mt-auto self-start px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] text-[0.9rem] font-semibold no-underline hover:bg-[var(--primary-hover)]"
            >
              {nextAppointment ? "Ver agenda" : "Agendar com um professor"}
            </Link>
          </section>

          {/* fichas */}
          <section className="flex flex-col gap-3.5 p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px]">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <ClipboardList size={18} />
              <h2 className="m-0 text-[1.05rem] text-[var(--text)]">Minhas fichas</h2>
            </div>

            {lastWorkout ? (
              <>
                <p className="m-0 text-[var(--text-secondary)]">
                  <strong className="text-[1.6rem] text-[var(--text)]">{workouts.length}</strong>{" "}
                  {workouts.length === 1 ? "ficha criada" : "fichas criadas"}
                </p>
                <div className="px-3.5 py-3 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="text-[0.75rem] text-[var(--text-muted)] uppercase tracking-[0.04em]">
                    Mais recente
                  </span>
                  <h3 className="my-1 text-base">{lastWorkout.name}</h3>
                  <p className="m-0 text-[var(--text-muted)] text-[0.9rem]">
                    {lastWorkout.exercises?.length ?? 0}{" "}
                    {(lastWorkout.exercises?.length ?? 0) === 1
                      ? "exercício"
                      : "exercícios"}
                    {lastWorkout.goal ? ` · ${lastWorkout.goal}` : ""}
                  </p>
                </div>
                <Link
                  to={`/fichas/${lastWorkout.id}`}
                  className="mt-auto self-start px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] text-[0.9rem] font-semibold no-underline hover:bg-[var(--primary-hover)]"
                >
                  Abrir ficha
                </Link>
              </>
            ) : (
              <>
                <p className="m-0 text-[var(--text-muted)]">Você ainda não tem fichas de treino.</p>
                <Link
                  to="/fichas/nova"
                  className="mt-auto self-start px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] text-[0.9rem] font-semibold no-underline hover:bg-[var(--primary-hover)]"
                >
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
