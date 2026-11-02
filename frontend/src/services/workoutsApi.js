import { getSession } from "./session";

// fichas no banco (tabelas ficha_treino e ficha_exercicio).
// O back-end confere quem pode ver/editar; aqui sempre vai o id de quem está logado.
const API_URL = "http://localhost:3000";

export function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function me() {
  return getSession().userId;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response.status === 204) return null;

  const resultado = await response.json();
  if (!response.ok) {
    const erro = new Error(resultado.message || "Erro ao acessar as fichas.");
    erro.status = response.status;
    throw erro;
  }
  return resultado;
}

// Formato de uma ficha (o mesmo de antes, ids sempre em texto):
// { id, ownerId, ownerName, ownerLevel, name, goal, createdBy: { id, role, name },
//   createdAt, updatedAt, exercises: [{ lineId, exerciseId, name, bodyPart, equipment,
//   difficulty, sets, reps, load }] }
function fromApi(f) {
  return {
    id: String(f.id),
    ownerId: String(f.donoId),
    ownerName: f.donoNome,
    ownerLevel: f.donoNivel || undefined,
    name: f.nome,
    goal: f.objetivo,
    createdBy: f.criadoPor
      ? { id: String(f.criadoPor.id), role: f.criadoPor.perfil, name: f.criadoPor.nome }
      : null,
    createdAt: f.criadaEm,
    updatedAt: f.atualizadaEm,
    exercises: f.exercicios.map((e) => ({
      lineId: String(e.id),
      exerciseId: e.exercicioRef,
      name: e.nome,
      bodyPart: e.parteCorpo,
      equipment: e.equipamento,
      difficulty: e.dificuldade,
      sets: e.series,
      reps: e.repeticoes,
      load: e.carga ?? "",
    })),
  };
}

function toApi(workout) {
  return {
    usuarioId: me(),
    donoId: workout.ownerId,
    nome: workout.name,
    objetivo: workout.goal ?? "",
    exercicios: workout.exercises.map((l) => ({
      exercicioRef: l.exerciseId,
      nome: l.name,
      parteCorpo: l.bodyPart,
      equipamento: l.equipment,
      dificuldade: l.difficulty,
      series: l.sets,
      repeticoes: l.reps,
      carga: l.load,
    })),
  };
}

// todas as fichas que o usuário logado enxerga
export async function listWorkouts() {
  const lista = await request(`/fichas?usuarioId=${me()}`);
  return lista.map(fromApi);
}

export async function listWorkoutsOf(ownerId) {
  const lista = await request(`/usuarios/${ownerId}/fichas?usuarioId=${me()}`);
  return lista.map(fromApi);
}

// null se a ficha não existe ou o usuário não tem acesso
export async function getWorkout(id) {
  try {
    return fromApi(await request(`/fichas/${id}?usuarioId=${me()}`));
  } catch (erro) {
    if (erro.status === 403 || erro.status === 404) return null;
    throw erro;
  }
}

// cria (sem id) ou atualiza (com id)
export async function saveWorkout(workout) {
  const salvo = workout.id
    ? await request(`/fichas/${workout.id}`, { method: "PUT", body: JSON.stringify(toApi(workout)) })
    : await request("/fichas", { method: "POST", body: JSON.stringify(toApi(workout)) });
  return fromApi(salvo);
}

export async function deleteWorkout(id) {
  await request(`/fichas/${id}?usuarioId=${me()}`, { method: "DELETE" });
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
