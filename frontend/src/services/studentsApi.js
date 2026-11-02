import { listAppointments } from "./appointmentsApi";

const API_URL = "http://localhost:3000";

// Alunos do professor: vínculo pelo código, feito pelo aluno ou pelo professor (tabela professor_aluno).
// O admin vê todos os alunos. Os agendamentos ainda ficam no navegador, então
// "appointments" e "next" só aparecem quando houver agendamento salvo aqui.
export async function listStudentsOfProfessor(session, { statuses = ["confirmed"] } = {}) {
  const url =
    session.role === "admin"
      ? `${API_URL}/alunos`
      : `${API_URL}/professores/${session.professorId}/alunos`;

  if (session.role !== "admin" && !session.professorId) return [];

  const response = await fetch(url);
  if (!response.ok) throw new Error("Não foi possível carregar os alunos.");
  const alunos = await response.json();

  const all = await listAppointments();
  const mine =
    session.role === "admin"
      ? all
      : all.filter((a) => a.professorId === session.professorId);

  const now = new Date();

  return alunos
    .map((aluno) => {
      const id = String(aluno.id);
      const entry = {
        id,
        name: aluno.nome,
        level: aluno.nivel || undefined,
        appointments: 0,
        next: null,
      };

      for (const a of mine) {
        if (String(a.studentId) !== id || !statuses.includes(a.status)) continue;
        entry.appointments += 1;
        const when = new Date(`${a.date}T${a.time}:00`);
        if (when >= now && (!entry.next || when < new Date(`${entry.next.date}T${entry.next.time}:00`))) {
          entry.next = a;
        }
      }

      return entry;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// o professor adiciona um aluno pelo código do aluno. Devolve o nome do aluno.
export async function addStudentByCode(session, codigo) {
  const response = await fetch(`${API_URL}/professores/${session.professorId}/alunos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo }),
  });

  const resultado = await response.json();
  if (!response.ok) {
    throw new Error(resultado.message || "Não foi possível adicionar o aluno.");
  }
  return resultado.aluno.nome;
}

export async function getStudentOfProfessor(session, studentId) {
  const students = await listStudentsOfProfessor(session);
  return students.find((s) => s.id === String(studentId)) ?? null;
}
