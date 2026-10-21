const bcrypt = require("bcrypt");
const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const usuarioRepository = require("../repositories/usuarioRepository");
const professorRepository = require("../repositories/professorRepository");

async function cadastrar(dados) {
    const nome = String(dados.nome ?? "").trim();
    const email = String(dados.email ?? "").trim();
    const matricula = String(dados.matricula ?? "").trim();

    if (!nome || !email || !dados.senha || !matricula) {
        throw new AppError(400, "preencha nome, email, matricula e senha");
    }

    const senha_hash = await bcrypt.hash(dados.senha, 10);
    await usuarioRepository.criar({ ...dados, nome, email, matricula, senha_hash });
}

async function login(matricula, senha) {
    const matriculaLimpa = String(matricula ?? "").trim();

    if (!matriculaLimpa || !senha) {
        throw new AppError(400, "informe matricula e senha!");
    }

    const user = await usuarioRepository.buscarPorMatricula(matriculaLimpa);
    const senhaCerta = user && (await bcrypt.compare(senha, user.senha_hash));

    // TEMPORÁRIO: remover depois
    console.log("login:", JSON.stringify(matriculaLimpa), "| achou:", !!user, "| senhaCerta:", !!senhaCerta);

    if (!senhaCerta) {
        throw new AppError(401, "usuario ou senha errados!");
    }

    const professorId = await professorRepository.buscarIdPorUsuario(user.idUsuario);
    return Usuario.toPublico(user, professorId);
}

module.exports = { cadastrar, login };