// import { listarTodosExercicios } from "./exerciseApi";
// import { PopularExercises } from "../utils/PopularExercises";
// import { traduzirNomeExercicio, palavrasDesconhecidas } from "../utils/exerciseNamePt";
// import { trBodyPart, trEquipment, trMuscle } from "../utils/translations";

// const CACHE_KEY = "unifit:catalog:all:v2";
// let allPromise = null; // a lista inteira é carregada uma única vez
// const indice = new Map(); // id -> palavras pesquisáveis (fica fora do objeto do exercício)

// // "Tríceps" -> "triceps"
// const semAcento = (t) =>
//   String(t ?? "")
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase();

// // formato único usado pelas telas e pelas fichas
// function normalize(ex, namePt) {
//   return {
//     id: ex.id,
//     name: namePt ?? traduzirNomeExercicio(ex.name).pt,
//     bodyPart: ex.bodyPart,
//     equipment: ex.equipment,
//     difficulty: ex.difficulty,
//     target: ex.target,
//     englishName: ex.name,
//   };
// }

// function lerCache() {
//   try {
//     const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
//     return Array.isArray(cached) && cached.length > 500 ? cached : null;
//   } catch {
//     return null;
//   }
// }

// async function carregar() {
//   let bruto = lerCache();

//   if (!bruto) {
//     const dados = await listarTodosExercicios(); // 1 requisição, traz todos
//     bruto = dados.map((e) => ({
//       id: e.id,
//       name: e.name,
//       bodyPart: e.bodyPart,
//       equipment: e.equipment,
//       difficulty: e.difficulty,
//       target: e.target,
//     }));
//     try {
//       localStorage.setItem(CACHE_KEY, JSON.stringify(bruto));
//     } catch {
//       // sem espaço no localStorage: segue sem cache
//     }
//   }

//   const lista = bruto
//     .map((e) => normalize(e))
//     .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

//   for (const ex of lista) {
//     const texto = semAcento(
//       [ex.name, ex.englishName, trBodyPart(ex.bodyPart), trEquipment(ex.equipment), trMuscle(ex.target)].join(" ")
//     );
//     indice.set(ex.id, texto.split(/[^a-z0-9]+/).filter(Boolean));
//   }

//   if (import.meta.env.DEV && palavrasDesconhecidas.size) {
//     const top = [...palavrasDesconhecidas].sort((a, b) => b[1] - a[1]);
//     console.warn("[UniFit] Palavras sem tradução (adicione em utils/exerciseNamePt.js):", Object.fromEntries(top));
//   }
//   return lista;
// }

// // todos os exercícios, já traduzidos e ordenados (cache em memória + localStorage)
// export function getAllExercises() {
//   if (!allPromise) {
//     allPromise = carregar().catch((err) => {
//       allPromise = null; // permite tentar de novo
//       throw err;
//     });
//   }
//   return allPromise;
// }

// // Busca por prefixo, sem acento, em qualquer ordem:
// // "su" -> Supino reto, Supino inclinado... | "sup inc" -> Supino inclinado
// // Também encontra por equipamento, região e músculo ("halter", "peito", "triceps").
// export function filterExercises(lista, termo) {
//   const tokens = semAcento(termo).split(/\s+/).filter(Boolean);
//   if (!tokens.length) return lista;

//   const achados = lista.filter((ex) => {
//     const palavras = indice.get(ex.id) ?? [];
//     return tokens.every((t) => palavras.some((p) => p.startsWith(t)));
//   });

//   // quem começa com o que foi digitado aparece primeiro (a ordem alfabética é mantida)
//   return achados.sort(
//     (a, b) =>
//       Number(!semAcento(a.name).startsWith(tokens[0])) -
//       Number(!semAcento(b.name).startsWith(tokens[0]))
//   );
// }

// // usada pelo ExercisePicker
// export async function searchCatalog(termo) {
//   if (!termo.trim()) return [];
//   return filterExercises(await getAllExercises(), termo);
// }

// // populares (nome em português curado), sem gastar requisições da API
// export async function getPopularExercises() {
//   const todos = await getAllExercises();
//   return PopularExercises.map((item) => {
//     const alvo = item.match.toLowerCase();
//     const ex =
//       todos.find((e) => e.englishName.toLowerCase() === alvo) ??
//       todos.find((e) => e.englishName.toLowerCase().includes(alvo));
//     return ex ? { ...ex, name: item.pt } : null;
//   }).filter(Boolean);
// }

// // converte o exercício da página de detalhes para o formato das fichas
// export function fromDetail(exercicio, displayName) {
//   return normalize(exercicio, displayName);
// }

import { listarTodosExercicios } from "./exerciseApi";
import { PopularExercises } from "../utils/PopularExercises";
import { traduzirNomeExercicio, palavrasDesconhecidas } from "../utils/exerciseNamePt";
import { trBodyPart, trEquipment, trMuscle } from "../utils/translations";

let allPromise = null; // a lista inteira é carregada uma única vez
// "Tríceps" -> "triceps"
const semAcento = (t) =>
  String(t ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const indice = new Map(); // id -> palavras pesquisáveis (fica fora do objeto do exercício)
const freq = new Map(); // primeira palavra do nome -> quantos exercícios começam com ela

const primeiraPalavra = (nome) => semAcento(nome).split(/[^a-z0-9]+/)[0];

// formato único usado pelas telas e pelas fichas
function normalize(ex, namePt) {
  return {
    id: ex.id,
    name: namePt ?? ex.namePt ?? traduzirNomeExercicio(ex.name).pt,
    bodyPart: ex.bodyPart,
    equipment: ex.equipment,
    difficulty: ex.difficulty,
    target: ex.target,
    secondaryMuscles: ex.secondaryMuscles,
    images: ex.images,
    englishName: ex.name,
  };
}

async function carregar() {
  const bruto = await listarTodosExercicios(); // lê public/exercises.json

  const lista = bruto
    .map((e) => normalize(e))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  for (const ex of lista) {
    const texto = semAcento(
      [ex.name, ex.englishName, trBodyPart(ex.bodyPart), trEquipment(ex.equipment), trMuscle(ex.target)].join(" ")
    );
    indice.set(ex.id, texto.split(/[^a-z0-9]+/).filter(Boolean));
    const w = primeiraPalavra(ex.name);
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  if (import.meta.env.DEV && palavrasDesconhecidas.size) {
    const top = [...palavrasDesconhecidas].sort((a, b) => b[1] - a[1]);
    console.warn("[UniFit] Palavras sem tradução (adicione em utils/exerciseNamePt.js):", Object.fromEntries(top));
  }
  return lista;
}

// todos os exercícios, já traduzidos e ordenados (cache em memória)
export function getAllExercises() {
  if (!allPromise) {
    allPromise = carregar().catch((err) => {
      allPromise = null; // permite tentar de novo
      throw err;
    });
  }
  return allPromise;
}

// Busca por prefixo, sem acento, em qualquer ordem:
// "su" -> Supino reto, Supino inclinado... | "sup inc" -> Supino inclinado
// Também encontra por equipamento, região e músculo ("halter", "peito", "triceps").
export function filterExercises(lista, termo) {
  const tokens = semAcento(termo).split(/\s+/).filter(Boolean);
  if (!tokens.length) return lista;

  const achados = lista.filter((ex) => {
    const palavras = indice.get(ex.id) ?? [];
    return tokens.every((t) => palavras.some((p) => p.startsWith(t)));
  });

  // 1º quem começa com o que foi digitado; 2º grupos maiores (Supino, Agachamento...);
  // 3º ordem alfabética (o sort é estável)
  const prioridade = (ex) => [
    Number(!semAcento(ex.name).startsWith(tokens[0])),
    -(freq.get(primeiraPalavra(ex.name)) ?? 0),
  ];
  return achados.sort((a, b) => {
    const [a1, a2] = prioridade(a);
    const [b1, b2] = prioridade(b);
    return a1 - b1 || a2 - b2;
  });
}

// usada pelo ExercisePicker
export async function searchCatalog(termo) {
  if (!termo.trim()) return [];
  return filterExercises(await getAllExercises(), termo);
}

// populares (nome em português curado), sem gastar requisições da API
export async function getPopularExercises() {
  const todos = await getAllExercises();
  return PopularExercises.map((item) => {
    const alvo = item.match.toLowerCase();
    const ex =
      todos.find((e) => e.englishName.toLowerCase() === alvo) ??
      todos.find((e) => e.englishName.toLowerCase().includes(alvo));
    return ex ? { ...ex, name: item.pt } : null;
  }).filter(Boolean);
}

// converte o exercício da página de detalhes para o formato das fichas
export function fromDetail(exercicio, displayName) {
  return normalize(exercicio, displayName);
}