const db = require("../config/database");

async function buscarIdPorUsuario(idUsuario) {
  const [linhas] = await db.query(
    "SELECT idProfessor FROM professor WHERE usuario_idUsuario = ?",
    [idUsuario]
  );
  return linhas[0]?.idProfessor ?? null;
}

module.exports = { buscarIdPorUsuario };