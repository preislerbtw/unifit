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
import {
  DASHBOARD_PAGE,
  DASHBOARD_SUBTITLE,
  DASHBOARD_SECTION,
  STAT_GRID,
  STAT_CARD,
  STAT_CARD_STRONG,
  STAT_CARD_SPAN,
  STAT_CARD_LINK_HOVER,
  STAT_TITLE,
  DASHBOARD_LIST,
  DASHBOARD_ROW,
  DASHBOARD_ROW_H3,
  DASHBOARD_ROW_P,
  DASHBOARD_EMPTY,
} from "../styles/dashboardClasses";
import {
  APPOINTMENT_DATE,
  APPOINTMENT_DATE_STRONG,
  APPOINTMENT_DATE_SPAN,
  APPOINTMENT_WEEKDAY,
} from "../styles/scheduleClasses";

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
    <div className={DASHBOARD_PAGE}>
      <h1>Painel</h1>
      <p className={DASHBOARD_SUBTITLE}>
        Olá, {session.name}! Acompanhe seus atendimentos e alunos.
      </p>

      <div className={STAT_GRID}>
        {cards.map(({ label, value, icon: Icon, to }) => {
          const content = (
            <>
              <Icon size={22} />
              <strong className={STAT_CARD_STRONG}>{value}</strong>
              <span className={STAT_CARD_SPAN}>{label}</span>
            </>
          );
          return to ? (
            <Link key={label} to={to} className={`${STAT_CARD} ${STAT_CARD_LINK_HOVER}`}>
              {content}
            </Link>
          ) : (
            <div key={label} className={STAT_CARD}>
              {content}
            </div>
          );
        })}
      </div>

      <h2 className={DASHBOARD_SECTION}>Próximos atendimentos</h2>
      {stats.upcoming.length > 0 ? (
        <div className={DASHBOARD_LIST}>
          {stats.upcoming.slice(0, 5).map((a) => {
            const { day, month, weekday } = dateParts(a);
            return (
              <div key={a.id} className={DASHBOARD_ROW}>
                <div className={APPOINTMENT_DATE} aria-hidden="true">
                  <strong className={APPOINTMENT_DATE_STRONG}>{day}</strong>
                  <span className={APPOINTMENT_DATE_SPAN}>{month}</span>
                </div>
                <div>
                  <h3 className={DASHBOARD_ROW_H3}>{a.studentName}</h3>
                  <p className={DASHBOARD_ROW_P}>
                    {a.type} ·{" "}
                    <span className={APPOINTMENT_WEEKDAY}>{weekday}</span> às{" "}
                    {a.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={DASHBOARD_EMPTY}>
          Nenhum atendimento confirmado por enquanto.
        </div>
      )}

      <h2 className={DASHBOARD_SECTION}>Atalhos</h2>
      <div className={STAT_GRID}>
        <Link to="/alunos" className={`${STAT_CARD} ${STAT_CARD_LINK_HOVER}`}>
          <Users size={22} />
          <strong className={STAT_TITLE}>Alunos e fichas</strong>
          <span className={STAT_CARD_SPAN}>Crie fichas de acordo com o nível de cada aluno</span>
        </Link>
        {session.role === "professor" && (
          <Link to="/chat" className={`${STAT_CARD} ${STAT_CARD_LINK_HOVER}`}>
            <MessageCircle size={22} />
            <strong className={STAT_TITLE}>Chat</strong>
            <span className={STAT_CARD_SPAN}>Converse com seus alunos</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
