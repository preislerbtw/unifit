import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, GraduationCap } from "lucide-react";
import {
  listAppointments,
  cancelAppointment,
} from "../services/appointmentsApi";
import "../styles/Schedule.css";
import { createAppointment } from "../services/appointmentsApi";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

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
      className={`appointment-card ${
        appointment.status === "cancelled" ? "is-cancelled" : ""
      }`}
    >
      <div className="appointment-date" aria-hidden="true">
        <strong>{day}</strong>
        <span>{month}</span>
      </div>

      <div className="appointment-info">
        <div className="appointment-title">
          <h3>{appointment.type}</h3>
          <span className={`status-badge status-${appointment.status}`}>
            {STATUS_LABEL[appointment.status]}
          </span>
        </div>

        <p>
          <GraduationCap size={14} /> {appointment.professorName}
        </p>
        <p>
          <Clock size={14} />
          <span className="appointment-weekday">{weekday}</span> às{" "}
          {appointment.time}
        </p>
        <p>
          <MapPin size={14} /> {appointment.gym}
        </p>
      </div>

      {canCancel && (
        <button className="appointment-cancel" onClick={() => onCancel(appointment)}>
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

  useEffect(() => {
    listAppointments()
      .then(setAppointments)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // separa em próximos (futuros e não cancelados) e histórico (o resto)
  const { upcoming, history } = useMemo(() => {
    const now = new Date();
    const up = [];
    const past = [];

    for (const a of appointments) {
      if (a.status !== "cancelled" && toDate(a) >= now) up.push(a);
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
    <div className="schedule-page">
      <h1>Agenda</h1>
      <p className="schedule-subtitle">
        Acompanhe suas avaliações físicas e aulas agendadas com os professores.
      </p>

      <div className="schedule-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "upcoming"}
          className={tab === "upcoming" ? "is-active" : ""}
          onClick={() => setTab("upcoming")}
        >
          Próximos ({upcoming.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === "history"}
          className={tab === "history" ? "is-active" : ""}
          onClick={() => setTab("history")}
        >
          Histórico ({history.length})
        </button>
      </div>

      {loading && <p>Carregando agenda...</p>}

      {!loading && list.length > 0 && (
        <div className="schedule-list">
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
        <div className="schedule-empty">
          {tab === "upcoming" ? (
            <>
              <p>Você não tem agendamentos próximos.</p>
              <Link to="/professores" className="schedule-link">
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