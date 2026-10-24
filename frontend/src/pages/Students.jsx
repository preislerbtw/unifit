import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { getSession } from "../services/session";
import { listStudentsOfProfessor } from "../services/studentsApi";
import { listWorkouts } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { dateParts } from "../utils/appointmentDate";
import { PROF_BTN, PROF_BTN_PRIMARY, PROF_BTN_SECONDARY, PROFESSOR_TAG } from "../styles/professorsClasses";
import {
  DASHBOARD_PAGE,
  DASHBOARD_SUBTITLE,
  DASHBOARD_EMPTY,
  DASHBOARD_LIST,
  REQUEST_TITLE,
  STUDENT_CARD,
  STUDENT_AVATAR,
  STUDENT_INFO,
  STUDENT_INFO_H3,
  STUDENT_INFO_P,
  STUDENT_ACTIONS,
  STUDENT_ACTIONS_BTN_EXTRA,
} from "../styles/dashboardClasses";

function initials(name) {
  const parts = name.split(" ").filter(Boolean);
  return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
}

// lista de alunos atendidos pelo professor
function Students() {
  const [session] = useState(getSession);
  const [students, setStudents] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listStudentsOfProfessor(session), listWorkouts()])
      .then(([s, w]) => {
        setStudents(s);
        setWorkouts(w);
      })
      .finally(() => setLoading(false));
  }, [session]);

  // fichas que este professor criou para o aluno (o admin vê todas)
  const countFor = (studentId) =>
    workouts.filter(
      (w) =>
        w.ownerId === studentId &&
        (session.role === "admin" || w.createdBy?.id === session.userId)
    ).length;

  return (
    <div className={DASHBOARD_PAGE}>
      <h1>Alunos</h1>
      <p className={DASHBOARD_SUBTITLE}>
        Alunos com atendimento confirmado. Abra um aluno para criar e editar as fichas dele.
      </p>

      {loading && <p>Carregando alunos...</p>}

      {!loading && students.length === 0 && (
        <div className={DASHBOARD_EMPTY}>
          Você ainda não tem alunos. Aceite uma solicitação em <Link to="/solicitacoes">Solicitações</Link>.
        </div>
      )}

      <div className={DASHBOARD_LIST}>
        {students.map((s) => (
          <article key={s.id} className={STUDENT_CARD}>
            <div className={STUDENT_AVATAR} aria-hidden="true">
              {initials(s.name)}
            </div>

            <div className={STUDENT_INFO}>
              <div className={REQUEST_TITLE}>
                <h3 className={STUDENT_INFO_H3}>{s.name}</h3>
                <span className={PROFESSOR_TAG}>{levelLabel(s.level)}</span>
              </div>
              <p className={STUDENT_INFO_P}>
                {s.appointments}{" "}
                {s.appointments === 1 ? "atendimento" : "atendimentos"} · {countFor(s.id)}{" "}
                {countFor(s.id) === 1 ? "ficha criada" : "fichas criadas"}
              </p>
              {s.next && (
                <p className={STUDENT_INFO_P}>
                  <Calendar size={14} /> Próximo: {dateParts(s.next).day}/
                  {String(new Date(`${s.next.date}T00:00:00`).getMonth() + 1).padStart(2, "0")} às{" "}
                  {s.next.time}
                </p>
              )}
            </div>

            <div className={STUDENT_ACTIONS}>
              <Link
                to={`/alunos/${s.id}`}
                className={`${PROF_BTN} ${PROF_BTN_PRIMARY} flex-none no-underline ${STUDENT_ACTIONS_BTN_EXTRA}`}
              >
                Fichas
              </Link>
              {session.role === "professor" && (
                <Link
                  to={`/chat/${s.id}`}
                  className={`${PROF_BTN} ${PROF_BTN_SECONDARY} flex-none no-underline ${STUDENT_ACTIONS_BTN_EXTRA}`}
                >
                  Chat
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Students;
