import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { getSession } from "../services/session";
import { listStudentsOfProfessor } from "../services/studentsApi";
import { listWorkouts } from "../services/workoutsApi";
import { levelLabel } from "../utils/levels";
import { dateParts } from "../utils/appointmentDate";
import "../styles/Professors.css"; // botões
import "../styles/Dashboard.css";

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
    <div className="dashboard-page">
      <h1>Alunos</h1>
      <p className="dashboard-subtitle">
        Alunos com atendimento confirmado. Abra um aluno para criar e editar as fichas dele.
      </p>

      {loading && <p>Carregando alunos...</p>}

      {!loading && students.length === 0 && (
        <div className="dashboard-empty">
          Você ainda não tem alunos. Aceite uma solicitação em <Link to="/solicitacoes">Solicitações</Link>.
        </div>
      )}

      <div className="dashboard-list">
        {students.map((s) => (
          <article key={s.id} className="student-card">
            <div className="student-avatar" aria-hidden="true">
              {initials(s.name)}
            </div>

            <div className="student-info">
              <div className="request-title">
                <h3>{s.name}</h3>
                <span className="professor-tag">{levelLabel(s.level)}</span>
              </div>
              <p>
                {s.appointments}{" "}
                {s.appointments === 1 ? "atendimento" : "atendimentos"} · {countFor(s.id)}{" "}
                {countFor(s.id) === 1 ? "ficha criada" : "fichas criadas"}
              </p>
              {s.next && (
                <p>
                  <Calendar size={14} /> Próximo: {dateParts(s.next).day}/
                  {String(new Date(`${s.next.date}T00:00:00`).getMonth() + 1).padStart(2, "0")} às{" "}
                  {s.next.time}
                </p>
              )}
            </div>

            <div className="student-actions">
              <Link to={`/alunos/${s.id}`} className="prof-btn prof-btn-primary">
                Fichas
              </Link>
              {session.role === "professor" && (
                <Link to={`/chat/${s.id}`} className="prof-btn prof-btn-secondary">
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
