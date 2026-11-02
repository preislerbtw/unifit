const db = require("../config/database");

const CAMPOS = `
       p.idProfessor,
       u.idUsuario,
       u.nome,
       p.especialidade,
       p.bio,
       a.Nome AS academia
     FROM professor p
     JOIN usuario u ON u.idUsuario = p.usuario_idUsuario
     JOIN academia a ON a.idAcademia = p.academia_idAcademia`;

async function buscarIdPorUsuario(idUsuario) {
  const [linhas] = await db.query(
    "SELECT idProfessor FROM professor WHERE usuario_idUsuario = ?",
    [idUsuario]
  );
  return linhas[0]?.idProfessor ?? null;
}

async function listar() {
  const [linhas] = await db.query(`SELECT ${CAMPOS} ORDER BY u.nome`);
  return linhas;
}

async function buscarPorCodigo(codigo) {
  const [linhas] = await db.query(`SELECT ${CAMPOS} WHERE u.codigo = ?`, [codigo]);
  return linhas[0] ?? null;
}

// professores que o aluno adicionou
async function listarDoAluno(idAluno) {
  const [linhas] = await db.query(
    `SELECT ${CAMPOS}
     JOIN professor_aluno pa ON pa.professor_idProfessor = p.idProfessor
     WHERE pa.aluno_idUsuario = ?
     ORDER BY u.nome`,
    [idAluno]
  );
  return linhas;
}

// devolve false se o vinculo ja existia
async function vincularAluno(idProfessor, idAluno) {
  const [resultado] = await db.query(
    "INSERT IGNORE INTO professor_aluno (professor_idProfessor, aluno_idUsuario) VALUES (?, ?)",
    [idProfessor, idAluno]
  );
  return resultado.affectedRows > 0;
}

// alunos que adicionaram o professor
async function listarAlunos(idProfessor) {
  const [linhas] = await db.query(
    `SELECT u.idUsuario, u.nome, u.nivel_experiencia, u.matricula, u.curso, pa.criado_em
     FROM professor_aluno pa
     JOIN usuario u ON u.idUsuario = pa.aluno_idUsuario
     WHERE pa.professor_idProfessor = ?
     ORDER BY u.nome`,
    [idProfessor]
  );
  return linhas;
}

async function temAluno(idProfessor, idAluno) {
  const [linhas] = await db.query(
    "SELECT 1 FROM professor_aluno WHERE professor_idProfessor = ? AND aluno_idUsuario = ?",
    [idProfessor, idAluno]
  );
  return linhas.length > 0;
}

module.exports = {
  buscarIdPorUsuario,
  listar,
  buscarPorCodigo,
  listarDoAluno,
  vincularAluno,
  listarAlunos,
  temAluno,
};
