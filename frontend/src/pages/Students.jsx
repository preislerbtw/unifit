import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
import AddByCodeModal from "../components/AddByCodeModal";
import { getSession } from "../services/session";
import { listStudentsOfProfessor, addStudentByCode } from "../services/studentsApi";
import { listWorkouts } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { dateParts } from "../utils/appointmentDate";
import {
  PROF_BTN,
  PROF_BTN_PRIMARY,
  PROF_BTN_SECONDARY,
  PROF_NOTICE,
  PROFESSOR_TAG,
} from "../styles/professorsClasses";
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
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.all([listStudentsOfProfessor(session), listWorkouts()])
      .then(([s, w]) => {
        setStudents(s);
        setWorkouts(w);
      })
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  async function confirmStudent(codigo) {
    const name = await addStudentByCode(session, codigo);
    // recarrega para trazer as fichas que o aluno já tinha
    const [s, w] = await Promise.all([listStudentsOfProfessor(session), listWorkouts()]);
    setStudents(s);
    setWorkouts(w);
    setAdding(false);
    setNotice(`${name} foi adicionado aos seus alunos.`);
  }

  // fichas do aluno (as que ele montou e as que os professores criaram)
  const countFor = (studentId) => workouts.filter((w) => w.ownerId === studentId).length;

  return (
    <div className={DASHBOARD_PAGE}>
      <div className="flex items-center justify-between gap-4">
        <h1>Alunos</h1>
        {session.role === "professor" && (
          <button
            className={`${PROF_BTN} ${PROF_BTN_PRIMARY} flex-none`}
            onClick={() => setAdding(true)}
          >
            <Plus size={16} /> Adicionar
          </button>
        )}
      </div>
      <p className={DASHBOARD_SUBTITLE}>
        Alunos ligados a você pelo código. Abra um aluno para ver e editar as fichas dele.
      </p>

      {notice && (
        <p className={PROF_NOTICE} role="status">
          {notice}
        </p>
      )}

      {loading && <p>Carregando alunos...</p>}

      {!loading && students.length === 0 && (
        <div className={DASHBOARD_EMPTY}>
          Você ainda não tem alunos. Clique em Adicionar e digite o código do aluno, ou passe o
          seu código (está no <Link to="/Perfil">Perfil</Link>) para ele adicionar você.
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
                {countFor(s.id) === 1 ? "ficha" : "fichas"}
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

      {adding && (
        <AddByCodeModal
          title="Adicionar aluno"
          subtitle="Peça ao aluno o código que aparece no perfil dele."
          onClose={() => setAdding(false)}
          onConfirm={confirmStudent}
        />
      )}
    </div>
  );
}

export default Students;
