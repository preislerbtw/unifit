import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  CalendarCheck,
  CalendarDays,
  Users,
  ClipboardList,
  MessageCircle
} from "lucide-react";
import { listAppointments } from "../services/appointmentsApi";
import { listWorkouts } from "../services/workoutsApi";
import { getSession } from "../services/session";
import { toDate, todayISO, dateParts } from "../utils/appointmentDate";
import "../styles/Schedule.css";
import "../styles/Dashboard.css";

function Dashboard() {
  const [session] = useState(getSession);
  const [appointments, setAppointments] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    listAppointments().then(setAppointments);
    listWorkouts().then(setWorkouts);
  }, []);

  // o professor vê só os próprios dados; o admin vê todos
  const mine = useMemo(
    () =>
      session.role === "admin"
        ? appointments
        : appointments.filter((a) => a.professorId === session.professorId),
    [appointments, session.role, session.professorId],
  );

  // fichas criadas por quem está logado (o admin vê as de todos os professores)
  const createdWorkouts = useMemo(
    () =>
      workouts.filter((w) =>
        session.role === "admin"
          ? w.createdBy?.role !== "aluno"
          : w.createdBy?.id === session.userId,
      ).length,
    [workouts, session.role, session.userId],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const today = todayISO();
    const upcoming = mine
      .filter((a) => a.status === "confirmed" && toDate(a) >= now)
      .sort((a, b) => toDate(a) - toDate(b));

    return {
      pending: mine.filter((a) => a.status === "pending").length,
      today: upcoming.filter((a) => a.date === today).length,
      upcoming,
      students: new Set(
        mine
          .filter((a) => a.status === "confirmed")
          .map((a) => a.studentId ?? a.studentName),
      ).size,
    };
  }, [mine]);

  const cards = [
    {
      label: "Solicitações pendentes",
      value: stats.pending,
      icon: Inbox,
      to: "/solicitacoes",
    },
    { label: "Atendimentos hoje", value: stats.today, icon: CalendarCheck },
    {
      label: "Próximos confirmados",
      value: stats.upcoming.length,
      icon: CalendarDays,
    },
    {
      label: "Alunos atendidos",
      value: stats.students,
      icon: Users,
      to: "/alunos",
    },
    {
      label: "Fichas criadas",
      value: createdWorkouts,
      icon: ClipboardList,
      to: "/alunos",
    },
  ];

  return (
    <div className="dashboard-page">
      <h1>Painel</h1>
      <p className="dashboard-subtitle">
        Olá, {session.name}! Acompanhe seus atendimentos e alunos.
      </p>

      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon, to }) => {
          const content = (
            <>
              <Icon size={22} />
              <strong>{value}</strong>
              <span>{label}</span>
            </>
          );
          return to ? (
            <Link key={label} to={to} className="stat-card is-link">
              {content}
            </Link>
          ) : (
            <div key={label} className="stat-card">
              {content}
            </div>
          );
        })}
      </div>

      <h2 className="dashboard-section">Próximos atendimentos</h2>
      {stats.upcoming.length > 0 ? (
        <div className="dashboard-list">
          {stats.upcoming.slice(0, 5).map((a) => {
            const { day, month, weekday } = dateParts(a);
            return (
              <div key={a.id} className="dashboard-row">
                <div className="appointment-date" aria-hidden="true">
                  <strong>{day}</strong>
                  <span>{month}</span>
                </div>
                <div>
                  <h3>{a.studentName}</h3>
                  <p>
                    {a.type} ·{" "}
                    <span className="appointment-weekday">{weekday}</span> às{" "}
                    {a.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dashboard-empty">
          Nenhum atendimento confirmado por enquanto.
        </div>
      )}

      <h2 className="dashboard-section">Atalhos</h2>
      <div className="stat-grid">
        <Link to="/alunos" className="stat-card is-link">
          <Users size={22} />
          <strong className="stat-title">Alunos e fichas</strong>
          <span>Crie fichas de acordo com o nível de cada aluno</span>
        </Link>
        {session.role === "professor" && (
          <Link to="/chat" className="stat-card is-link">
            <MessageCircle size={22} />
            <strong className="stat-title">Chat</strong>
            <span>Converse com seus alunos</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
