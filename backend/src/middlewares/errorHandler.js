const AppError = require("../errors/AppError");

function naoEncontrado(req, res) {
    return res.status(404).json({
        message: "Rota não encontrada!"
    });
}

function errorHandler(erro, req, res, next) {
    console.error("Erro na aplicação:", {
        message: erro.message,
        status: erro.status,
        stack: erro.stack
    });

    // Erros tratados pela aplicação
    if (typeof AppError === "function" && erro instanceof AppError) {
        return res.status(erro.status).json({
            message: erro.message
        });
    }

    // Erro de duplicidade no banco de dados
    if (erro.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            message: "Matrícula ou email já cadastrado!"
        });
    }

    // Erros inesperados
    return res.status(500).json({
        message: "Erro interno no servidor!"
    });
}

module.exports = {
    naoEncontrado,
    errorHandler
};