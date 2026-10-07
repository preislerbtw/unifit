import { useState, useEffect, useMemo } from "react";
import { Clock, MapPin, User, AlertTriangle } from "lucide-react";
import {
  listAppointments,
  updateAppointmentStatus,
  professorHasConfirmedAt,
  ConflictError,
} from "../services/appointmentsApi";
import { getSession } from "../services/session";
import { toDate, dateParts } from "../utils/appointmentDate";
import { levelLabel } from "../utils/levels";
import "../styles/Schedule.css";
import "../styles/Professors.css";
import "../styles/Dashboard.css";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Aceito",
  rejected: "Recusado",
  cancelled: "Cancelado pelo aluno",
};

function Requests() {
  const [session] = useState(getSession);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    listAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const { pending, answered } = useMemo(() => {
    const mine =
      session.role === "admin"
        ? appointments
        : appointments.filter((a) => a.professorId === session.professorId);

    return {
      pending: mine
        .filter((a) => a.status === "pending")
        .sort((a, b) => toDate(a) - toDate(b)),
      answered: mine
        .filter((a) => a.status !== "pending")
        .sort((a, b) => toDate(b) - toDate(a)),
    };
  }, [appointments, session.role, session.professorId]);

  async function answer(appointment, status) {
    setError("");
    if (
      status === "rejected" &&
      !window.confirm(`Recusar a solicitação de ${appointment.studentName}?`)
    ) {
      return;
    }

    try {
      await updateAppointmentStatus(appointment.id, status);
    } catch (err) {
      if (err instanceof ConflictError) {
        setError(err.message);
        return;
      }
      throw err;
    }

    setAppointments((list) =>
      list.map((a) => (a.id === appointment.id ? { ...a, status } : a))
    );
  }

  const list = tab === "pending" ? pending : answered;

  return (
    <div className="dashboard-page">
      <h1>Solicitações</h1>
      <p className="dashboard-subtitle">
        Aceite ou recuse os pedidos de avaliação física e aula dos alunos.
      </p>

      <div className="schedule-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "pending"}
          className={tab === "pending" ? "is-active" : ""}
          onClick={() => setTab("pending")}
        >
          Pendentes ({pending.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === "answered"}
          className={tab === "answered" ? "is-active" : ""}
          onClick={() => setTab("answered")}
        >
          Respondidas ({answered.length})
        </button>
      </div>

      {error && (
        <p className="request-error" role="alert">
          {error}
        </p>
      )}

      {loading && <p>Carregando solicitações...</p>}

      {!loading && list.length === 0 && (
        <div className="dashboard-empty">
          {tab === "pending"
            ? "Nenhuma solicitação pendente."
            : "Você ainda não respondeu nenhuma solicitação."}
        </div>
      )}

      <div className="dashboard-list">
        {list.map((a) => {
          const { day, month, weekday } = dateParts(a);
          // já existe outro atendimento confirmado neste mesmo horário?
          const conflict =
            a.status === "pending" &&
            professorHasConfirmedAt(appointments, a.professorId, a, a.id);

          return (
            <article key={a.id} className="request-card">
              <div className="appointment-date" aria-hidden="true">
                <strong>{day}</strong>
                <span>{month}</span>
              </div>

              <div className="request-info">
                <div className="request-title">
                  <h3>{a.type}</h3>
                  <span className={`status-badge status-${a.status}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
                <p>
                  <User size={14} /> {a.studentName}
                  {a.studentLevel && <> · nível {levelLabel(a.studentLevel).toLowerCase()}</>}
                </p>
                <p>
                  <Clock size={14} />
                  <span className="appointment-weekday">{weekday}</span> às{" "}
                  {a.time}
                </p>
                <p>
                  <MapPin size={14} /> {a.gym}
                </p>
                {conflict && (
                  <p className="request-conflict">
                    <AlertTriangle size={14} /> Conflito: você já tem um atendimento
                    confirmado neste horário.
                  </p>
                )}
              </div>

              {a.status === "pending" && (
                <div className="request-actions">
                  <button
                    className="prof-btn prof-btn-primary"
                    disabled={conflict}
                    onClick={() => answer(a, "confirmed")}
                  >
                    Aceitar
                  </button>
                  <button
                    className="request-reject"
                    onClick={() => answer(a, "rejected")}
                  >
                    Recusar
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Requests;
