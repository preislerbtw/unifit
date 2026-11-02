const AppError = require("../errors/AppError");
const fichaRepository = require("../repositories/fichaRepository");
const professorRepository = require("../repositories/professorRepository");
const usuarioRepository = require("../repositories/usuarioRepository");

// Quem pode o quê:
// - aluno:     vê as próprias fichas; edita só as que ele mesmo criou
// - professor: vê e edita todas as fichas dos alunos que o adicionaram pelo código
// - admin:     tudo

function formatar(f) {
  return {
    id: f.idFicha_treino,
    donoId: f.usuario_idUsuario,
    donoNome: f.dono_nome,
    donoNivel: f.dono_nivel,
    nome: f.nome,
    objetivo: f.objetivo,
    criadoPor: f.criado_por_idUsuario
      ? { id: f.criado_por_idUsuario, nome: f.criador_nome, perfil: f.criador_perfil }
      : null,
    criadaEm: f.criada_em,
    atualizadaEm: f.atualizada_em,
    exercicios: f.exercicios.map((e) => ({
      id: e.idFicha_exercicio,
      exercicioRef: e.exercicio_ref,
      nome: e.exercicio_nome,
      parteCorpo: e.parte_corpo,
      equipamento: e.equipamento,
      dificuldade: e.dificuldade,
      series: e.series,
      repeticoes: e.repeticoes,
      carga: e.carga,
    })),
  };
}

async function buscarUsuario(idUsuario) {
  if (!idUsuario) throw new AppError(400, "Usuário não informado!");
  const usuario = await usuarioRepository.buscarPorId(idUsuario);
  if (!usuario) throw new AppError(404, "Usuário não encontrado!");
  return usuario;
}

// o professor so mexe nos alunos que o adicionaram
async function ehProfessorDoAluno(usuario, idAluno) {
  if (usuario.perfil !== "professor") return false;
  const idProfessor = await professorRepository.buscarIdPorUsuario(usuario.idUsuario);
  return idProfessor != null && professorRepository.temAluno(idProfessor, idAluno);
}

async function podeVer(usuario, idDono) {
  if (usuario.perfil === "admin") return true;
  if (String(usuario.idUsuario) === String(idDono)) return true;
  return ehProfessorDoAluno(usuario, idDono);
}

async function podeEditar(usuario, ficha) {
  if (usuario.perfil === "admin") return true;
  if (String(usuario.idUsuario) === String(ficha.usuario_idUsuario)) {
    return String(ficha.criado_por_idUsuario) === String(usuario.idUsuario);
  }
  return ehProfessorDoAluno(usuario, ficha.usuario_idUsuario);
}

async function buscarFicha(idFicha) {
  const ficha = await fichaRepository.buscarPorId(idFicha);
  if (!ficha) throw new AppError(404, "Ficha não encontrada!");
  return ficha;
}

function validar(dados) {
  const nome = String(dados.nome ?? "").trim();
  const objetivo = String(dados.objetivo ?? "").trim();
  const exercicios = Array.isArray(dados.exercicios) ? dados.exercicios : [];

  if (!nome) throw new AppError(400, "Dê um nome para a ficha.");
  if (nome.length > 100) throw new AppError(400, "O nome da ficha é muito longo.");
  if (exercicios.length === 0) throw new AppError(400, "Adicione pelo menos um exercício.");

  return {
    nome,
    objetivo: objetivo.slice(0, 255),
    exercicios: exercicios.map((e) => ({
      exercicioRef: e.exercicioRef != null ? String(e.exercicioRef).slice(0, 100) : null,
      nome: String(e.nome ?? "").slice(0, 150),
      parteCorpo: e.parteCorpo ? String(e.parteCorpo).slice(0, 45) : null,
      equipamento: e.equipamento ? String(e.equipamento).slice(0, 45) : null,
      dificuldade: e.dificuldade ? String(e.dificuldade).slice(0, 45) : null,
      series: Math.max(1, parseInt(e.series, 10) || 1),
      repeticoes: Math.max(1, parseInt(e.repeticoes, 10) || 1),
      carga: e.carga ? String(e.carga).trim().slice(0, 20) : null,
    })),
  };
}

async function listarDoDono(idUsuario, idDono) {
  const usuario = await buscarUsuario(idUsuario);
  if (!(await podeVer(usuario, idDono))) {
    throw new AppError(403, "Você não tem acesso às fichas desse aluno.");
  }
  const fichas = await fichaRepository.listarDoDono(idDono);
  return fichas.map(formatar);
}

// todas as fichas que o usuario enxerga (usado nas contagens do painel)
async function listarVisiveis(idUsuario) {
  const usuario = await buscarUsuario(idUsuario);
  let fichas;
  if (usuario.perfil === "admin") {
    fichas = await fichaRepository.listarTodas();
  } else if (usuario.perfil === "professor") {
    const idProfessor = await professorRepository.buscarIdPorUsuario(usuario.idUsuario);
    fichas = idProfessor ? await fichaRepository.listarDosAlunosDoProfessor(idProfessor) : [];
  } else {
    fichas = await fichaRepository.listarDoDono(usuario.idUsuario);
  }
  return fichas.map(formatar);
}

async function buscar(idUsuario, idFicha) {
  const usuario = await buscarUsuario(idUsuario);
  const ficha = await buscarFicha(idFicha);
  if (!(await podeVer(usuario, ficha.usuario_idUsuario))) {
    throw new AppError(403, "Você não tem acesso a essa ficha.");
  }
  return formatar(ficha);
}

async function criar(idUsuario, dados) {
  const usuario = await buscarUsuario(idUsuario);
  const idDono = dados.donoId ?? usuario.idUsuario;

  const ehDono = String(idDono) === String(usuario.idUsuario);
  const pode = usuario.perfil === "admin" || ehDono || (await ehProfessorDoAluno(usuario, idDono));
  if (!pode) throw new AppError(403, "Você não pode criar fichas para esse aluno.");

  const idFicha = await fichaRepository.criar({
    ...validar(dados),
    idDono,
    idCriador: usuario.idUsuario,
  });
  return formatar(await buscarFicha(idFicha));
}

async function atualizar(idUsuario, idFicha, dados) {
  const usuario = await buscarUsuario(idUsuario);
  const ficha = await buscarFicha(idFicha);
  if (!(await podeEditar(usuario, ficha))) {
    throw new AppError(403, "Você não pode editar essa ficha.");
  }
  await fichaRepository.atualizar(idFicha, validar(dados));
  return formatar(await buscarFicha(idFicha));
}

async function excluir(idUsuario, idFicha) {
  const usuario = await buscarUsuario(idUsuario);
  const ficha = await buscarFicha(idFicha);
  if (!(await podeEditar(usuario, ficha))) {
    throw new AppError(403, "Você não pode excluir essa ficha.");
  }
  await fichaRepository.excluir(idFicha);
}

module.exports = { listarDoDono, listarVisiveis, buscar, criar, atualizar, excluir };
