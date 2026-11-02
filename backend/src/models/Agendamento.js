// formato do agendamento que sai da API (o mesmo que o front ja usava no localStorage)
function toPublico(row) {
  return {
    id: row.idAgendamento,
    studentId: String(row.usuario_idUsuario), // o front compara com session.userId (string)
    professorId: row.professor_idProfessor,   // o front compara com session.professorId (numero)
    studentName: row.aluno_nome,
    studentLevel: row.aluno_nivel ?? undefined,
    professorName: row.professor_nome,
    gym: row.academia,
    type: row.tipo,
    date: row.data,      // "2026-10-05"
    time: row.horario,   // "14:00"
    status: row.status,  // pending | confirmed | rejected | cancelled
    cancelledBy: row.cancelado_por ?? undefined,
  };
}

module.exports = { toPublico };