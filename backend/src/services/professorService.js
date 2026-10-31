const professorRepository = require("../repositories/professorRepository");

// usuarioId é o que o chat usa (chat_mensagem guarda ids de usuario);
// id (idProfessor) é o que o agendamento usa.
async function listar() {
  const linhas = await professorRepository.listar();
  return linhas.map((linha) => ({
    id: linha.idProfessor,
    usuarioId: linha.idUsuario,
    nome: linha.nome,
    especialidade: linha.especialidade,
    academia: linha.academia,
    bio: linha.bio,
  }));
}

module.exports = { listar };
