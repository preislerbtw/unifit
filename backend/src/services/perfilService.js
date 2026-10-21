const AppError = require("../errors/AppError");
const usuarioRepository = require("../repositories/usuarioRepository");

async function atualizarMedidas(idUsuario, peso, altura) {
    const p = Number(peso)
    const a = Number(altura);

    if(!idUsuario) {
        throw new AppError(400, "usuario nao informado!");
    }
    if(!Number.isFinite(p) || p < 20 || p > 300) {
        throw new AppError(400, "peso invalido!");
    }
    if(!Number.isFinite(a) || a < 1 || a > 2.5) {
        throw new AppError(400, "altura invalida!")
    }
    const linhas = await usuarioRepository.atualizarMedidas(idUsuario, p, a);
    if(linhas === 0) {
        throw new AppError(404, "usuario não encontrado!");
        // 404 - usuario nao encontrado
    }
    return { peso: p, altura: a };
}
module.exports = { atualizarMedidas };