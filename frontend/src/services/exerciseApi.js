// const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
// const BASE_URL = "https://exercisedb.p.rapidapi.com";

// const headers = {
//   "X-RapidAPI-Key": API_KEY,
//   "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
// };

// export async function buscarExercicios(nome = "") {
//   if (!nome.trim()) return [];

//   const url = `${BASE_URL}/exercises/name/${encodeURIComponent(nome)}`;
//   const response = await fetch(url, { headers });

//   if (!response.ok) throw new Error("Erro ao buscar exercícios");
//   return response.json();
// }

// export async function listarTodosExercicios(limit = 0) {
//   const url = `${BASE_URL}/exercises?limit=${limit}`;
//   const response = await fetch(url, { headers });

//   if (!response.ok) throw new Error("Erro ao carregar exercícios");
//   return response.json();
// }

// export async function buscarExercicioPorId(id) {
//   const url = `${BASE_URL}/exercises/exercise/${id}`;
//   const response = await fetch(url, { headers });

//   if (!response.ok) throw new Error("Erro ao buscar exercício");
//   return response.json();
// }

import { NOMES_PT, NOMES_PT_CHECK } from "../data/nomesPt";

// Base: free-exercise-db (domínio público). O arquivo fica em public/exercises.json
// e é lido do seu próprio projeto: sem chave, sem cota, sem limite.
const ARQUIVO = "/exercises.json";

// músculo principal -> região do corpo (as chaves existem em translations.js)
const REGIAO = {
  chest: "chest",
  shoulders: "shoulders",
  biceps: "upper arms",
  triceps: "upper arms",
  forearms: "lower arms",
  lats: "back",
  "middle back": "back",
  "lower back": "back",
  traps: "back",
  quadriceps: "upper legs",
  hamstrings: "upper legs",
  adductors: "upper legs",
  abductors: "upper legs",
  glutes: "glutes",
  calves: "lower legs",
  abdominals: "waist",
  neck: "neck",
};

let promessa = null;

function adaptar(lista) {
  // só usa os nomes curados se o arquivo for o mesmo que foi traduzido
  const c = NOMES_PT_CHECK;
  const alinhado =
    lista.length === c.total &&
    NOMES_PT.length === c.total &&
    lista[0].name === c.primeiro &&
    lista[c.meio.indice].name === c.meio.nome &&
    lista[lista.length - 1].name === c.ultimo;

  return lista.map((e, i) => {
    const alvo = e.primaryMuscles?.[0];
    return {
      id: e.id,
      name: e.name, // inglês (usado na busca)
      namePt: alinhado ? NOMES_PT[i] : null,
      bodyPart: e.category === "cardio" ? "cardio" : REGIAO[alvo] ?? "waist",
      equipment: e.equipment ?? "none",
      difficulty: e.level,
      target: alvo,
      secondaryMuscles: e.secondaryMuscles ?? [],
      instructions: e.instructions ?? [],
      images: e.images ?? [],
      category: e.category,
    };
  });
}

function carregar() {
  promessa ??= fetch(ARQUIVO)
    .then((r) => {
      if (!r.ok) throw new Error(`não achei ${ARQUIVO} (coloque o arquivo em public/)`);
      return r.json();
    })
    .then(adaptar)
    .catch((err) => {
      promessa = null; // permite tentar de novo
      throw err;
    });
  return promessa;
}

export async function listarTodosExercicios() {
  return carregar();
}

export async function buscarExercicioPorId(id) {
  const todos = await carregar();
  const achado = todos.find((e) => String(e.id) === String(id));
  if (!achado) throw new Error("exercício não encontrado");
  return achado;
}

export async function buscarExercicios(nome = "") {
  const termo = nome.trim().toLowerCase();
  if (!termo) return [];
  const todos = await carregar();
  return todos.filter((e) => e.name.toLowerCase().includes(termo));
}