import { listAppointments } from "./appointmentsApi";

// Alunos de um professor, a partir dos agendamentos.
// Quando houver back-end: GET /professores/:id/alunos
export async function listStudentsOfProfessor(session, { statuses = ["confirmed"] } = {}) {
  const all = await listAppointments();
  const mine =
    session.role === "admin"
      ? all
      : all.filter((a) => a.professorId === session.professorId);

  const now = new Date();
  const map = new Map();

  for (const a of mine) {
    if (!a.studentId || !statuses.includes(a.status)) continue;

    const entry = map.get(a.studentId) ?? {
      id: a.studentId,
      name: a.studentName,
      level: a.studentLevel,
      appointments: 0,
      next: null,
    };

    entry.appointments += 1;
    if (a.studentLevel) entry.level = a.studentLevel;

    const when = new Date(`${a.date}T${a.time}:00`);
    if (when >= now && (!entry.next || when < new Date(`${entry.next.date}T${entry.next.time}:00`))) {
      entry.next = a;
    }

    map.set(a.studentId, entry);
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getStudentOfProfessor(session, studentId) {
  const students = await listStudentsOfProfessor(session);
  return students.find((s) => s.id === studentId) ?? null;
}
