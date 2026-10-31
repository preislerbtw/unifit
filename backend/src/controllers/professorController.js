const professorService = require("../services/professorService");

async function listar(req, res) {
    const resultado = await professorService.listar();
    res.json(resultado);
}

module.exports = { listar };
