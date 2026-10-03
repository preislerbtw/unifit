// armazenamento provisório no navegador (localStorage).
// quando o back-end existir (tabela AGENDAMENTO), troque o corpo destas funções
// por chamadas fetch: GET /agendamentos, POST /agendamentos, PATCH /agendamentos/:id
const KEY = "unifit:appointments";

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

export async function listAppointments() {
  return read();
}

export async function createAppointment(data) {
  const appointment = { id: newId(), status: "pending", ...data };
  write([...read(), appointment]);
  return appointment;
}

export async function cancelAppointment(id) {
  write(read().map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
}