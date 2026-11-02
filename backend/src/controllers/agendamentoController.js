const agendamentoService = require("../services/agendamentoService");

async function listar(req, res) {
    res.json(await agendamentoService.listar(req.query));
}

async function ocupados(req, res) {
    res.json(await agendamentoService.horariosOcupados(req.query));
}

async function criar(req, res) {
    const agendamento = await agendamentoService.criar(req.body);
    res.status(201).json(agendamento);
}

async function atualizarStatus(req, res) {
    res.json(await agendamentoService.atualizarStatus(req.params.id, req.body));
}

module.exports = { listar, ocupados, criar, atualizarStatus };