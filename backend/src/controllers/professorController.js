const professorService = require("../services/professorService");

async function listar(req, res) {
    const resultado = await professorService.listar();
    res.json(resultado);
}

async function listarDoAluno(req, res) {
    const resultado = await professorService.listarDoAluno(req.params.idUsuario);
    res.json(resultado);
}

async function adicionarPorCodigo(req, res) {
    const professor = await professorService.adicionarPorCodigo(req.params.idUsuario, req.body.codigo);
    res.status(201).json({ message: `${professor.nome} adicionado!`, professor });
}

async function listarAlunos(req, res) {
    res.json(await professorService.listarAlunos(req.params.idProfessor));
}

async function listarTodosAlunos(req, res) {
    res.json(await professorService.listarTodosAlunos());
}

async function adicionarAlunoPorCodigo(req, res) {
    const aluno = await professorService.adicionarAlunoPorCodigo(req.params.idProfessor, req.body.codigo);
    res.status(201).json({ message: `${aluno.nome} adicionado!`, aluno });
}

module.exports = {
    listar,
    listarDoAluno,
    adicionarPorCodigo,
    adicionarAlunoPorCodigo,
    listarAlunos,
    listarTodosAlunos,
};
