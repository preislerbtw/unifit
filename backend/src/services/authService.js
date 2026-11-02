const bcrypt = require("bcrypt");
const AppError = require("../errors/AppError");
const Usuario = require("../models/Usuario");
const usuarioRepository = require("../repositories/usuarioRepository");
const professorRepository = require("../repositories/professorRepository");
const { gerarCodigo } = require("../utils/codigoUsuario");

async function cadastrar(dados) {
    const nome = String(dados.nome ?? "").trim();
    const email = String(dados.email ?? "").trim();
    const matricula = String(dados.matricula ?? "").trim();

    if (!nome || !email || !dados.senha || !matricula) {
        throw new AppError(400, "Preencha nome, email, matricula e senha");
    }

    // so aceita boolean de verdade, qualquer outra coisa vira false/true padrao
    const quer_personal = dados.quer_personal !== false;
    const aceitou_termos = dados.aceitou_termos === true;

    if (!quer_personal && !aceitou_termos) {
        throw new AppError(
            400,
            "Para treinar sem personal, é necessário aceitar o termo de responsabilidade."
        );
    }

    const senha_hash = await bcrypt.hash(dados.senha, 10);

    // o codigo e sorteado; se ja existir no banco, sorteia de novo
    for (let tentativa = 0; tentativa < 20; tentativa++) {
        try {
            await usuarioRepository.criar({
                ...dados,
                nome,
                email,
                matricula,
                senha_hash,
                quer_personal,
                aceitou_termos: quer_personal ? false : aceitou_termos,
                codigo: gerarCodigo(),
            });
            return;
        } catch (erro) {
            if (!ehCodigoRepetido(erro)) throw erro;
        }
    }
    throw new AppError(503, "Não foi possível gerar um código único. Tente novamente.");
}

function ehCodigoRepetido(erro) {
    return erro.code === "ER_DUP_ENTRY" && String(erro.sqlMessage).includes("codigo_UNIQUE");
}

async function login(matricula, senha) {
    const matriculaLimpa = String(matricula ?? "").trim();

    if (!matriculaLimpa || !senha) {
        throw new AppError(400, "Informe matricula e senha!");
    }

    const user = await usuarioRepository.buscarPorMatricula(matriculaLimpa);
    const senhaCerta = user && (await bcrypt.compare(senha, user.senha_hash));

    // TEMPORÁRIO: remover depois
    console.log("login:", JSON.stringify(matriculaLimpa), "| achou:", !!user, "| senhaCerta:", !!senhaCerta);

    if (!senhaCerta) {
        throw new AppError(401, "Usuário ou senha errados!");
    }

    const professorId = await professorRepository.buscarIdPorUsuario(user.idUsuario);
    return Usuario.toPublico(user, professorId);
}

module.exports = { cadastrar, login };