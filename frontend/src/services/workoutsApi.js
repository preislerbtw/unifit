// armazenamento provisório no navegador (localStorage).
// quando o back-end existir (tabelas FICHA_TREINO e FICHA_EXERCICIO), troque o corpo
// destas funções por chamadas fetch: GET/POST /fichas, PUT/DELETE /fichas/:id
const KEY = "unifit:workouts";

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

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

// Formato de uma ficha:
// { id, ownerId, ownerName, ownerLevel, name, goal, createdBy: { id, role, name },
//   createdAt, updatedAt, exercises: [{ lineId, exerciseId, name, bodyPart, equipment,
//   difficulty, sets, reps, load }] }

export async function listWorkouts() {
  return read();
}

export async function listWorkoutsOf(ownerId) {
  return read()
    .filter((w) => w.ownerId === ownerId)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

export async function getWorkout(id) {
  return read().find((w) => w.id === id) ?? null;
}

// cria (sem id) ou atualiza (com id)
export async function saveWorkout(workout) {
  const list = read();
  const now = new Date().toISOString();

  if (workout.id && list.some((w) => w.id === workout.id)) {
    const updated = { ...workout, updatedAt: now };
    write(list.map((w) => (w.id === workout.id ? updated : w)));
    return updated;
  }

  const created = { ...workout, id: newId(), createdAt: now, updatedAt: now };
  write([...list, created]);
  return created;
}

export async function deleteWorkout(id) {
  write(read().filter((w) => w.id !== id));
}

// linha de exercício dentro de uma ficha
export function makeLine(exercise, { sets = 3, reps = 12, load = "" } = {}) {
  return {
    lineId: newId(),
    exerciseId: exercise.id,
    name: exercise.name,
    bodyPart: exercise.bodyPart,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    sets,
    reps,
    load,
  };
}
