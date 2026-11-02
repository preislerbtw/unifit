const AppError = require("../errors/AppError");
const Agendamento = require("../models/Agendamento");
const agendamentoRepository = require("../repositories/agendamentoRepository");
const usuarioRepository = require("../repositories/usuarioRepository");

const TIPOS = ["Avaliação física", "Aula"];
const STATUS = ["pending", "confirmed", "rejected", "cancelled"];

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^\d{2}:\d{2}$/;

function inteiro(valor) {
    const n = Number(valor);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function montarDataHora(data, horario) {
    if (!REGEX_DATA.test(String(data)) || !REGEX_HORA.test(String(horario))) {
        throw new AppError(400, "Data ou horário inválidos.");
    }
    if (Number.isNaN(new Date(`${data}T${horario}:00`).getTime())) {
        throw new AppError(400, "Data ou horário inválidos.");
    }
    return `${data} ${horario}:00`;
}

// linha do banco -> data_hora no formato do MySQL
function dataHoraDe(linha) {
    return `${linha.data} ${linha.horario}:00`;
}

async function listar(filtros = {}) {
    const linhas = await agendamentoRepository.listar({
        alunoId: inteiro(filtros.alunoId),
        professorId: inteiro(filtros.professorId),
    });
    return linhas.map(Agendamento.toPublico);
}

async function horariosOcupados({ professorId, alunoId, data }) {
    if (!REGEX_DATA.test(String(data ?? ""))) {
        throw new AppError(400, "Informe a data.");
    }
    return agendamentoRepository.horariosOcupados({
        professorId: inteiro(professorId),
        alunoId: inteiro(alunoId),
        data,
    });
}

async function criar(dados) {
    const alunoId = inteiro(dados.studentId);
    const professorId = inteiro(dados.professorId);

    if (!alunoId) {
        throw new AppError(400, "Entre com a sua conta para agendar.");
    }
    if (!professorId) {
        throw new AppError(400, "Professor inválido.");
    }
    if (!TIPOS.includes(dados.type)) {
        throw new AppError(400, "Tipo de agendamento inválido.");
    }

    const dataHora = montarDataHora(dados.date, dados.time);

    const aluno = await usuarioRepository.buscarPorId(alunoId);
    if (!aluno) {
        throw new AppError(404, "Aluno não encontrado.");
    }

    if (await agendamentoRepository.alunoTemNoHorario(alunoId, dataHora)) {
        throw new AppError(409, "Você já tem um agendamento neste dia e horário.");
    }
    if (await agendamentoRepository.professorTemConfirmadoNoHorario(professorId, dataHora)) {
        throw new AppError(409, "Este horário já foi reservado por outro aluno.");
    }

    const id = await agendamentoRepository.criar({
        alunoId,
        professorId,
        tipo: dados.type,
        dataHora,
    });
    if (!id) {
        throw new AppError(404, "Professor não encontrado.");
    }

    return Agendamento.toPublico(await agendamentoRepository.buscarPorId(id));
}

// muda o status: confirmed/rejected so saem de "pending"; cancelled sai de "pending" ou "confirmed"
async function atualizarStatus(id, dados) {
    const idAgendamento = inteiro(id);
    const status = dados.status;

    if (!idAgendamento) {
        throw new AppError(400, "Agendamento inválido.");
    }
    if (!STATUS.includes(status) || status === "pending") {
        throw new AppError(400, "Status inválido.");
    }

    const agendamento = await agendamentoRepository.buscarPorId(idAgendamento);
    if (!agendamento) {
        throw new AppError(404, "Agendamento não encontrado.");
    }

    if (status === "cancelled") {
        if (!["pending", "confirmed"].includes(agendamento.status)) {
            throw new AppError(400, "Este agendamento não pode mais ser cancelado.");
        }
        const por = dados.cancelledBy === "professor" ? "professor" : "aluno";
        await agendamentoRepository.cancelar(idAgendamento, por);
    } else {
        if (agendamento.status !== "pending") {
            throw new AppError(400, "Esta solicitação já foi respondida.");
        }
        if (
            status === "confirmed" &&
            (await agendamentoRepository.professorTemConfirmadoNoHorario(
                agendamento.professor_idProfessor,
                dataHoraDe(agendamento),
                idAgendamento
            ))
        ) {
            throw new AppError(409, "Você já tem um atendimento confirmado neste horário.");
        }
        await agendamentoRepository.atualizarStatus(idAgendamento, status);
    }

    return Agendamento.toPublico(await agendamentoRepository.buscarPorId(idAgendamento));
}

module.exports = { listar, horariosOcupados, criar, atualizarStatus };