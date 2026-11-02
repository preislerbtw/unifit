const AppError = require("../errors/AppError");
const professorRepository = require("../repositories/professorRepository");
const usuarioRepository = require("../repositories/usuarioRepository");

// usuarioId é o que o chat usa (chat_mensagem guarda ids de usuario);
// id (idProfessor) é o que o agendamento usa.
function formatar(linha) {
  return {
    id: linha.idProfessor,
    usuarioId: linha.idUsuario,
    nome: linha.nome,
    especialidade: linha.especialidade,
    academia: linha.academia,
    bio: linha.bio,
  };
}

async function listar() {
  const linhas = await professorRepository.listar();
  return linhas.map(formatar);
}

async function listarDoAluno(idAluno) {
  const linhas = await professorRepository.listarDoAluno(idAluno);
  return linhas.map(formatar);
}

function validarCodigo(codigo) {
  const codigoLimpo = String(codigo ?? "").trim();
  if (!/^\d{4}$/.test(codigoLimpo)) {
    throw new AppError(400, "O código tem 4 números.");
  }
  return codigoLimpo;
}

// o aluno adiciona o professor pelo codigo do professor
async function adicionarPorCodigo(idAluno, codigo) {
  if (!idAluno) {
    throw new AppError(400, "Usuário não informado!");
  }
  const codigoLimpo = validarCodigo(codigo);

  const professor = await professorRepository.buscarPorCodigo(codigoLimpo);
  if (!professor) {
    throw new AppError(404, "Nenhum professor encontrado com esse código.");
  }
  if (String(professor.idUsuario) === String(idAluno)) {
    throw new AppError(400, "Esse é o seu próprio código.");
  }

  const novo = await professorRepository.vincularAluno(professor.idProfessor, idAluno);
  if (!novo) {
    throw new AppError(409, `${professor.nome} já está na sua lista.`);
  }

  return formatar(professor);
}

function formatarAluno(linha) {
  return {
    id: linha.idUsuario,
    nome: linha.nome,
    nivel: linha.nivel_experiencia,
    matricula: linha.matricula,
    curso: linha.curso,
    adicionadoEm: linha.criado_em ?? null,
  };
}

// o professor adiciona o aluno pelo codigo do aluno (mesmo vinculo da tabela professor_aluno)
async function adicionarAlunoPorCodigo(idProfessor, codigo) {
  if (!idProfessor) {
    throw new AppError(400, "Professor não informado!");
  }
  const codigoLimpo = validarCodigo(codigo);

  const aluno = await usuarioRepository.buscarPorCodigo(codigoLimpo);
  if (!aluno || aluno.perfil !== "aluno") {
    throw new AppError(404, "Nenhum aluno encontrado com esse código.");
  }

  const novo = await professorRepository.vincularAluno(idProfessor, aluno.idUsuario);
  if (!novo) {
    throw new AppError(409, `${aluno.nome} já está na sua lista.`);
  }

  return formatarAluno(aluno);
}

// alunos vinculados ao professor (quem adicionou ou foi adicionado pelo codigo)
async function listarAlunos(idProfessor) {
  const linhas = await professorRepository.listarAlunos(idProfessor);
  return linhas.map(formatarAluno);
}

// todos os alunos (visao do admin)
async function listarTodosAlunos() {
  const linhas = await usuarioRepository.listarAlunos();
  return linhas.map(formatarAluno);
}

module.exports = {
  listar,
  listarDoAluno,
  adicionarPorCodigo,
  adicionarAlunoPorCodigo,
  listarAlunos,
  listarTodosAlunos,
};
