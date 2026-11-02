const fichaService = require("../services/fichaService");

// usuarioId = quem esta fazendo a acao (vem na query nos GET/DELETE e no corpo nos POST/PUT)

async function listarVisiveis(req, res) {
    res.json(await fichaService.listarVisiveis(req.query.usuarioId));
}

async function listarDoDono(req, res) {
    res.json(await fichaService.listarDoDono(req.query.usuarioId, req.params.idUsuario));
}

async function buscar(req, res) {
    res.json(await fichaService.buscar(req.query.usuarioId, req.params.id));
}

async function criar(req, res) {
    const ficha = await fichaService.criar(req.body.usuarioId, req.body);
    res.status(201).json(ficha);
}

async function atualizar(req, res) {
    res.json(await fichaService.atualizar(req.body.usuarioId, req.params.id, req.body));
}

async function excluir(req, res) {
    await fichaService.excluir(req.query.usuarioId, req.params.id);
    res.status(204).end();
}

module.exports = { listarVisiveis, listarDoDono, buscar, criar, atualizar, excluir };
