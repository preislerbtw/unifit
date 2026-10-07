// junta "2026-10-05" + "14:00" em um objeto Date
export function toDate(appointment) {
  return new Date(`${appointment.date}T${appointment.time}:00`);
}

// data de hoje no formato "2026-10-05" (fuso local)
export function todayISO() {
  return new Date().toLocaleDateString("sv-SE");
}

export function dateParts(appointment) {
  const d = toDate(appointment);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    weekday: d.toLocaleDateString("pt-BR", { weekday: "long" }),
  };
}
