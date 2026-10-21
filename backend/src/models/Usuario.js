// formato do usuario que sai da API (nunca expõe senha_hash)
function toPublico(row, professorId = null) {
  return {
    id: row.idUsuario,
    nome: row.nome,
    email: row.email,
    data_nascimento: row.data_nascimento,
    objetivo: row.objetivo,
    nivel_experiencia: row.nivel_experiencia,
    perfil: row.perfil,
    matricula: row.matricula,
    curso: row.curso,
    altura: row.altura,
    peso: row.peso,
    professorId,
  };
}

module.exports = { toPublico };