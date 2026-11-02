// agendamentos: conversa com o back-end (tabela AGENDAMENTO)
//   GET   /agendamentos
//   GET   /agendamentos/ocupados
//   POST  /agendamentos
//   PATCH /agendamentos/:id/status
const API_URL = "http://localhost:3000";

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let resultado = null;
  try {
    resultado = await response.json();
  } catch {
    // resposta sem corpo JSON
  }

  if (!response.ok) {
    const message = resultado?.message || "Erro ao comunicar com o servidor.";
    // 409 = horario em conflito: o front mostra a mensagem ao usuario
    if (response.status === 409) throw new ConflictError(message);
    throw new Error(message);
  }

  return resultado;
}

const sameSlot = (a, b) => a.date === b.date && a.time === b.time;

// Regras de conflito (o back-end tambem valida):
// - o aluno não pode ter dois agendamentos ativos (pendente ou confirmado) no mesmo horário;
// - o professor não pode ter dois atendimentos CONFIRMADOS no mesmo horário.
//   (vários alunos podem pedir o mesmo horário; só um pode ser aceito)
export function professorHasConfirmedAt(list, professorId, slot, ignoreId) {
  return list.some(
    (a) =>
      a.id !== ignoreId &&
      a.professorId === professorId &&
      a.status === "confirmed" &&
      sameSlot(a, slot)
  );
}

// filtros opcionais: { alunoId, professorId }
export async function listAppointments(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.alunoId) params.set("alunoId", filtros.alunoId);
  if (filtros.professorId) params.set("professorId", filtros.professorId);

  const query = params.toString();
  return request(`/agendamentos${query ? `?${query}` : ""}`);
}

// horários já ocupados em um dia (usado para desabilitar opções no formulário)
export async function getBusySlots({ professorId, studentId, date }) {
  const params = new URLSearchParams({ data: date });
  if (professorId) params.set("professorId", professorId);
  if (studentId) params.set("alunoId", studentId);

  return request(`/agendamentos/ocupados?${params.toString()}`);
}

export async function createAppointment(data) {
  return request("/agendamentos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// status: "confirmed" | "rejected" | "cancelled"
// extra: campos adicionais (ex.: { cancelledBy: "professor" })
export async function updateAppointmentStatus(id, status, extra = {}) {
  return request(`/agendamentos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...extra }),
  });
}

// by: quem cancelou ("aluno" | "professor")
export async function cancelAppointment(id, by = "aluno") {
  return updateAppointmentStatus(id, "cancelled", { cancelledBy: by });
}