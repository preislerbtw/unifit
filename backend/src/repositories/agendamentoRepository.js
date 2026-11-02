const db = require("../config/database");

// DATE_FORMAT evita problema de fuso: data e hora saem como texto, igual o front usa
const CAMPOS = `
       a.idAgendamento,
       a.usuario_idUsuario,
       a.professor_idProfessor,
       a.tipo,
       a.status,
       a.cancelado_por,
       DATE_FORMAT(a.data_hora, '%Y-%m-%d') AS data,
       DATE_FORMAT(a.data_hora, '%H:%i') AS horario,
       alu.nome AS aluno_nome,
       alu.nivel_experiencia AS aluno_nivel,
       prof.nome AS professor_nome,
       ac.Nome AS academia
     FROM agendamento a
     JOIN usuario alu ON alu.idUsuario = a.usuario_idUsuario
     JOIN professor p ON p.idProfessor = a.professor_idProfessor
     JOIN usuario prof ON prof.idUsuario = p.usuario_idUsuario
     JOIN academia ac ON ac.idAcademia = a.academia_idAcademia`;

async function listar({ alunoId, professorId } = {}) {
  const condicoes = [];
  const valores = [];
  if (alunoId) {
    condicoes.push("a.usuario_idUsuario = ?");
    valores.push(alunoId);
  }
  if (professorId) {
    condicoes.push("a.professor_idProfessor = ?");
    valores.push(professorId);
  }
  const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
  const [linhas] = await db.query(`SELECT ${CAMPOS} ${where} ORDER BY a.data_hora`, valores);
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await db.query(`SELECT ${CAMPOS} WHERE a.idAgendamento = ?`, [id]);
  return linhas[0] ?? null;
}

// a academia vem do proprio professor. Devolve o id novo, ou null se o professor nao existe
async function criar({ alunoId, professorId, tipo, dataHora }) {
  const [resultado] = await db.query(
    `INSERT INTO agendamento
       (usuario_idUsuario, professor_idProfessor, academia_idAcademia, tipo, data_hora, status)
     SELECT ?, p.idProfessor, p.academia_idAcademia, ?, ?, 'pending'
     FROM professor p
     WHERE p.idProfessor = ?`,
    [alunoId, tipo, dataHora, professorId]
  );
  return resultado.affectedRows > 0 ? resultado.insertId : null;
}

async function alunoTemNoHorario(alunoId, dataHora) {
  const [linhas] = await db.query(
    `SELECT 1 FROM agendamento
     WHERE usuario_idUsuario = ? AND data_hora = ? AND status IN ('pending', 'confirmed')
     LIMIT 1`,
    [alunoId, dataHora]
  );
  return linhas.length > 0;
}

async function professorTemConfirmadoNoHorario(professorId, dataHora, ignorarId = 0) {
  const [linhas] = await db.query(
    `SELECT 1 FROM agendamento
     WHERE professor_idProfessor = ? AND data_hora = ? AND status = 'confirmed'
       AND idAgendamento <> ?
     LIMIT 1`,
    [professorId, dataHora, ignorarId]
  );
  return linhas.length > 0;
}

async function atualizarStatus(id, status) {
  await db.query("UPDATE agendamento SET status = ? WHERE idAgendamento = ?", [status, id]);
}

async function cancelar(id, por) {
  await db.query(
    `UPDATE agendamento
     SET status = 'cancelled', cancelado_por = ?, cancelado_em = NOW()
     WHERE idAgendamento = ?`,
    [por, id]
  );
}

// horarios ocupados em um dia: do professor (confirmados) e do aluno (pendentes ou confirmados)
async function horariosOcupados({ professorId, alunoId, data }) {
  let professor = [];
  let aluno = [];

  if (professorId) {
    const [linhas] = await db.query(
      `SELECT DATE_FORMAT(data_hora, '%H:%i') AS horario
       FROM agendamento
       WHERE professor_idProfessor = ? AND status = 'confirmed' AND DATE(data_hora) = ?`,
      [professorId, data]
    );
    professor = linhas.map((l) => l.horario);
  }

  if (alunoId) {
    const [linhas] = await db.query(
      `SELECT DATE_FORMAT(data_hora, '%H:%i') AS horario
       FROM agendamento
       WHERE usuario_idUsuario = ? AND status IN ('pending', 'confirmed') AND DATE(data_hora) = ?`,
      [alunoId, data]
    );
    aluno = linhas.map((l) => l.horario);
  }

  return { professor, student: aluno };
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  alunoTemNoHorario,
  professorTemConfirmadoNoHorario,
  atualizarStatus,
  cancelar,
  horariosOcupados,
};