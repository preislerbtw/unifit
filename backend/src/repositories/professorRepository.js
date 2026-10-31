const db = require("../config/database");

async function buscarIdPorUsuario(idUsuario) {
  const [linhas] = await db.query(
    "SELECT idProfessor FROM professor WHERE usuario_idUsuario = ?",
    [idUsuario]
  );
  return linhas[0]?.idProfessor ?? null;
}

async function listar() {
  const [linhas] = await db.query(
    `SELECT
       p.idProfessor,
       u.idUsuario,
       u.nome,
       p.especialidade,
       p.bio,
       a.Nome AS academia
     FROM professor p
     JOIN usuario u ON u.idUsuario = p.usuario_idUsuario
     JOIN academia a ON a.idAcademia = p.academia_idAcademia
     ORDER BY u.nome`
  );
  return linhas;
}

module.exports = { buscarIdPorUsuario, listar };