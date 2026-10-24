import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, GraduationCap } from "lucide-react";
import {
  listAppointments,
  cancelAppointment,
} from "../services/appointmentsApi";
import { getSession } from "../services/session";
import {
  SCHEDULE_PAGE,
  SCHEDULE_SUBTITLE,
  SCHEDULE_TABS,
  SCHEDULE_TAB_BTN,
  SCHEDULE_TAB_BTN_ACTIVE,
  SCHEDULE_LIST,
  APPOINTMENT_CARD,
  APPOINTMENT_CARD_CANCELLED,
  APPOINTMENT_DATE,
  APPOINTMENT_DATE_STRONG,
  APPOINTMENT_DATE_SPAN,
  APPOINTMENT_INFO,
  APPOINTMENT_INFO_P,
  APPOINTMENT_WEEKDAY,
  APPOINTMENT_TITLE,
  APPOINTMENT_TITLE_H3,
  STATUS_BADGE,
  STATUS_PENDING,
  STATUS_CONFIRMED,
  STATUS_CANCELLED,
  APPOINTMENT_CANCEL,
  SCHEDULE_EMPTY,
  SCHEDULE_LINK,
} from "../styles/scheduleClasses";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Confirmado",
  rejected: "Recusado",
  cancelled: "Cancelado",
};

const STATUS_CLASS = {
  pending: STATUS_PENDING,
  confirmed: STATUS_CONFIRMED,
  cancelled: STATUS_CANCELLED,
};

// agendamentos encerrados (vão direto para o histórico)
const CLOSED = ["cancelled", "rejected"];

// junta "2026-10-05" + "14:00" em um objeto Date
function toDate(appointment) {
  return new Date(`${appointment.date}T${appointment.time}:00`);
}

function AppointmentCard({ appointment, canCancel, onCancel }) {
  const d = toDate(appointment);
  const day = d.getDate();
  const month = d
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  const weekday = d.toLocaleDateString("pt-BR", { weekday: "long" });

  return (
    <article
      className={`${APPOINTMENT_CARD} ${
        CLOSED.includes(appointment.status) ? APPOINTMENT_CARD_CANCELLED : ""
      }`}
    >
      <div className={APPOINTMENT_DATE} aria-hidden="true">
        <strong className={APPOINTMENT_DATE_STRONG}>{day}</strong>
        <span className={APPOINTMENT_DATE_SPAN}>{month}</span>
      </div>

      <div className={APPOINTMENT_INFO}>
        <div className={APPOINTMENT_TITLE}>
          <h3 className={APPOINTMENT_TITLE_H3}>{appointment.type}</h3>
          <span className={`${STATUS_BADGE} ${STATUS_CLASS[appointment.status] ?? ""}`}>
            {STATUS_LABEL[appointment.status]}
          </span>
        </div>

        <p className={APPOINTMENT_INFO_P}>
          <GraduationCap size={14} /> {appointment.professorName}
        </p>
        <p className={APPOINTMENT_INFO_P}>
          <Clock size={14} />
          <span className={APPOINTMENT_WEEKDAY}>{weekday}</span> às{" "}
          {appointment.time}
        </p>
        <p className={APPOINTMENT_INFO_P}>
          <MapPin size={14} /> {appointment.gym}
        </p>
      </div>

      {canCancel && (
        <button className={APPOINTMENT_CANCEL} onClick={() => onCancel(appointment)}>
          Cancelar
        </button>
      )}
    </article>
  );
}

function Schedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const session = getSession();

  useEffect(() => {
    listAppointments()
      // o aluno vê só os próprios agendamentos
      .then((list) =>
        setAppointments(
          list.filter((a) => !a.studentId || a.studentId === session.userId)
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // separa em próximos (futuros e não cancelados) e histórico (o resto)
  const { upcoming, history } = useMemo(() => {
    const now = new Date();
    const up = [];
    const past = [];

    for (const a of appointments) {
      if (!CLOSED.includes(a.status) && toDate(a) >= now) up.push(a);
      else past.push(a);
    }

    up.sort((a, b) => toDate(a) - toDate(b)); // mais próximo primeiro
    past.sort((a, b) => toDate(b) - toDate(a)); // mais recente primeiro
    return { upcoming: up, history: past };
  }, [appointments]);

  async function handleCancel(appointment) {
    const ok = window.confirm(
      `Cancelar ${appointment.type.toLowerCase()} com ${appointment.professorName}?`
    );
    if (!ok) return;

    await cancelAppointment(appointment.id);
    setAppointments((list) =>
      list.map((a) =>
        a.id === appointment.id ? { ...a, status: "cancelled" } : a
      )
    );
  }

  const list = tab === "upcoming" ? upcoming : history;

  return (
    <div className={SCHEDULE_PAGE}>
      <h1>Agenda</h1>
      <p className={SCHEDULE_SUBTITLE}>
        Acompanhe suas avaliações físicas e aulas agendadas com os professores.
      </p>

      <div className={SCHEDULE_TABS} role="tablist">
        <button
          role="tab"
          aria-selected={tab === "upcoming"}
          className={`${SCHEDULE_TAB_BTN} ${tab === "upcoming" ? SCHEDULE_TAB_BTN_ACTIVE : ""}`}
          onClick={() => setTab("upcoming")}
        >
          Próximos ({upcoming.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === "history"}
          className={`${SCHEDULE_TAB_BTN} ${tab === "history" ? SCHEDULE_TAB_BTN_ACTIVE : ""}`}
          onClick={() => setTab("history")}
        >
          Histórico ({history.length})
        </button>
      </div>

      {loading && <p>Carregando agenda...</p>}

      {!loading && list.length > 0 && (
        <div className={SCHEDULE_LIST}>
          {list.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              canCancel={tab === "upcoming"}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className={SCHEDULE_EMPTY}>
          {tab === "upcoming" ? (
            <>
              <p>Você não tem agendamentos próximos.</p>
              <Link to="/professores" className={SCHEDULE_LINK}>
                Agendar com um professor
              </Link>
            </>
          ) : (
            <p>Nenhum agendamento no histórico.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Schedule;
