import { buscarExercicios, listarTodosExercicios } from "./exerciseApi";
import { PopularExercises } from "../utils/PopularExercises";
import { traduzirTermoBusca } from "../utils/ExcercisesTraduct";
import { trExerciseName } from "../utils/translations";

const POPULAR_KEY = "unifit:catalog:popular:v1";
let allCache = null; // lista grande, só em memória

// "barbell bench press" -> "Barbell bench press"
function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// formato único usado pelas fichas
function normalize(ex, namePt) {
  return {
    id: ex.id,
    name: capitalize(namePt ?? trExerciseName(ex.name) ?? ex.name),
    bodyPart: ex.bodyPart,
    equipment: ex.equipment,
    difficulty: ex.difficulty,
    target: ex.target,
    englishName: ex.name,
  };
}

// os exercícios populares (com nome em português), guardados em cache para
// não gastar a cota da API toda vez que abrir o seletor
export async function getPopularExercises() {
  try {
    const cached = JSON.parse(localStorage.getItem(POPULAR_KEY));
    if (cached?.length) return cached;
  } catch {
    // sem cache: busca na API
  }

  const found = await Promise.all(
    PopularExercises.map(async (item) => {
      try {
        const list = await buscarExercicios(item.match);
        return list?.length ? normalize(list[0], item.pt) : null;
      } catch {
        return null;
      }
    })
  );
  const popular = found.filter(Boolean);

  if (popular.length) {
    try {
      localStorage.setItem(POPULAR_KEY, JSON.stringify(popular));
    } catch {
      // ignora
    }
  }
  return popular;
}

// busca livre pelo nome (aceita português e inglês)
export async function searchCatalog(term) {
  const text = term.trim().toLowerCase();
  if (!text) return [];

  if (!allCache) allCache = await listarTodosExercicios();
  const translated = traduzirTermoBusca(text);

  return allCache
    .filter(
      (ex) =>
        ex.name.toLowerCase().includes(translated) ||
        ex.name.toLowerCase().includes(text)
    )
    .map((ex) => normalize(ex));
}

// converte o exercício da página de detalhes para o formato das fichas
export function fromDetail(exercicio, displayName) {
  return normalize(exercicio, displayName);
}
