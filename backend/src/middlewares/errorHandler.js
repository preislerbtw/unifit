const AppError = require("../errors/AppError");

function naoEncontrado(req, res) {
    res.status(404).json({message: "rota não encontrada!"});
    // 404 - rota/recurso solicitado nao foi encontrado
}

function errorHandler(erro, req, res, next) {
    if(erro instanceof AppError) {
        return res.status(erro.status).json({message: erro.message});
    }
    if(erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({message: "matricula ou email já cadastrado!"});
        // 409 - conflito com o estado atula do recurso
    }
    console.log(erro);
    res.status(500).json({message: "erro interno no servidor!"})
    // 500 - erro interno no servidor
}
module.exports = { naoEncontrado, errorHandler };