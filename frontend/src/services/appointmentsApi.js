// armazenamento provisório no navegador (localStorage).
// quando o back-end existir (tabela AGENDAMENTO), troque o corpo destas funções
// por chamadas fetch: GET /agendamentos, POST /agendamentos, PATCH /agendamentos/:id
const KEY = "unifit:appointments";
const ACTIVE = ["pending", "confirmed"];

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // localStorage indisponível: ignora
  }
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

const sameSlot = (a, b) => a.date === b.date && a.time === b.time;

// Regras de conflito:
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

export async function listAppointments() {
  return read();
}

// horários já ocupados em um dia (usado para desabilitar opções no formulário)
export async function getBusySlots({ professorId, studentId, date }) {
  const list = read();
  return {
    professor: list
      .filter((a) => a.professorId === professorId && a.status === "confirmed" && a.date === date)
      .map((a) => a.time),
    student: list
      .filter((a) => a.studentId === studentId && ACTIVE.includes(a.status) && a.date === date)
      .map((a) => a.time),
  };
}

export async function createAppointment(data) {
  const list = read();

  if (
    data.studentId &&
    list.some(
      (a) =>
        a.studentId === data.studentId &&
        ACTIVE.includes(a.status) &&
        sameSlot(a, data)
    )
  ) {
    throw new ConflictError("Você já tem um agendamento neste dia e horário.");
  }

  if (professorHasConfirmedAt(list, data.professorId, data)) {
    throw new ConflictError("Este horário já foi reservado por outro aluno.");
  }

  const appointment = { id: newId(), status: "pending", ...data };
  write([...list, appointment]);
  return appointment;
}

// status: "pending" | "confirmed" | "rejected" | "cancelled"
export async function updateAppointmentStatus(id, status) {
  const list = read();
  const target = list.find((a) => a.id === id);

  if (status === "confirmed" && target && professorHasConfirmedAt(list, target.professorId, target, id)) {
    throw new ConflictError("Você já tem um atendimento confirmado neste horário.");
  }

  write(list.map((a) => (a.id === id ? { ...a, status } : a)));
}

export async function cancelAppointment(id) {
  return updateAppointmentStatus(id, "cancelled");
}
