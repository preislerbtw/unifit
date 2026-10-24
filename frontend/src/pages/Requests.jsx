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
import { PROF_BTN, PROF_BTN_PRIMARY } from "../styles/professorsClasses";
import {
  SCHEDULE_TABS,
  SCHEDULE_TAB_BTN,
  SCHEDULE_TAB_BTN_ACTIVE,
  APPOINTMENT_WEEKDAY,
  APPOINTMENT_DATE,
  APPOINTMENT_DATE_STRONG,
  APPOINTMENT_DATE_SPAN,
  STATUS_BADGE,
  STATUS_PENDING,
  STATUS_CONFIRMED,
  STATUS_CANCELLED,
} from "../styles/scheduleClasses";
import {
  DASHBOARD_PAGE,
  DASHBOARD_SUBTITLE,
  DASHBOARD_EMPTY,
  DASHBOARD_LIST,
  REQUEST_CARD,
  REQUEST_INFO,
  REQUEST_INFO_P,
  REQUEST_TITLE,
  REQUEST_ACTIONS,
  REQUEST_ACTIONS_CHILD,
  REQUEST_ACTIONS_BTN_DISABLED,
  REQUEST_REJECT,
  REQUEST_ERROR,
  REQUEST_CONFLICT,
} from "../styles/dashboardClasses";

const STATUS_LABEL = {
  pending: "Pendente",
  confirmed: "Aceito",
  rejected: "Recusado",
  cancelled: "Cancelado pelo aluno",
};

const STATUS_CLASS = {
  pending: STATUS_PENDING,
  confirmed: STATUS_CONFIRMED,
  cancelled: STATUS_CANCELLED,
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
    <div className={DASHBOARD_PAGE}>
      <h1>Solicitações</h1>
      <p className={DASHBOARD_SUBTITLE}>
        Aceite ou recuse os pedidos de avaliação física e aula dos alunos.
      </p>

      <div className={SCHEDULE_TABS} role="tablist">
        <button
          role="tab"
          aria-selected={tab === "pending"}
          className={`${SCHEDULE_TAB_BTN} ${tab === "pending" ? SCHEDULE_TAB_BTN_ACTIVE : ""}`}
          onClick={() => setTab("pending")}
        >
          Pendentes ({pending.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === "answered"}
          className={`${SCHEDULE_TAB_BTN} ${tab === "answered" ? SCHEDULE_TAB_BTN_ACTIVE : ""}`}
          onClick={() => setTab("answered")}
        >
          Respondidas ({answered.length})
        </button>
      </div>

      {error && (
        <p className={REQUEST_ERROR} role="alert">
          {error}
        </p>
      )}

      {loading && <p>Carregando solicitações...</p>}

      {!loading && list.length === 0 && (
        <div className={DASHBOARD_EMPTY}>
          {tab === "pending"
            ? "Nenhuma solicitação pendente."
            : "Você ainda não respondeu nenhuma solicitação."}
        </div>
      )}

      <div className={DASHBOARD_LIST}>
        {list.map((a) => {
          const { day, month, weekday } = dateParts(a);
          // já existe outro atendimento confirmado neste mesmo horário?
          const conflict =
            a.status === "pending" &&
            professorHasConfirmedAt(appointments, a.professorId, a, a.id);

          return (
            <article key={a.id} className={REQUEST_CARD}>
              <div className={APPOINTMENT_DATE} aria-hidden="true">
                <strong className={APPOINTMENT_DATE_STRONG}>{day}</strong>
                <span className={APPOINTMENT_DATE_SPAN}>{month}</span>
              </div>

              <div className={REQUEST_INFO}>
                <div className={REQUEST_TITLE}>
                  <h3>{a.type}</h3>
                  <span className={`${STATUS_BADGE} ${STATUS_CLASS[a.status] ?? ""}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
                <p className={REQUEST_INFO_P}>
                  <User size={14} /> {a.studentName}
                  {a.studentLevel && <> · nível {levelLabel(a.studentLevel).toLowerCase()}</>}
                </p>
                <p className={REQUEST_INFO_P}>
                  <Clock size={14} />
                  <span className={APPOINTMENT_WEEKDAY}>{weekday}</span> às{" "}
                  {a.time}
                </p>
                <p className={REQUEST_INFO_P}>
                  <MapPin size={14} /> {a.gym}
                </p>
                {conflict && (
                  <p className={REQUEST_CONFLICT}>
                    <AlertTriangle size={14} /> Conflito: você já tem um atendimento
                    confirmado neste horário.
                  </p>
                )}
              </div>

              {a.status === "pending" && (
                <div className={REQUEST_ACTIONS}>
                  <button
                    className={`${PROF_BTN} ${PROF_BTN_PRIMARY} ${REQUEST_ACTIONS_BTN_DISABLED} ${REQUEST_ACTIONS_CHILD}`}
                    disabled={conflict}
                    onClick={() => answer(a, "confirmed")}
                  >
                    Aceitar
                  </button>
                  <button
                    className={`${REQUEST_REJECT} ${REQUEST_ACTIONS_CHILD}`}
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
