const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = "https://exercisedb.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

export async function buscarExercicios(nome = "") {
  if (!nome.trim()) return [];

  const url = `${BASE_URL}/exercises/name/${encodeURIComponent(nome)}`;
  const response = await fetch(url, { headers });

  if (!response.ok) throw new Error("Erro ao buscar exercícios");
  return response.json();
}

export async function listarTodosExercicios(limit = 300) {
  const url = `${BASE_URL}/exercises?limit=${limit}`;
  const response = await fetch(url, { headers });

  if (!response.ok) throw new Error("Erro ao carregar exercícios");
  return response.json();
}

export async function buscarExercicioPorId(id) {
  const url = `${BASE_URL}/exercises/exercise/${id}`;
  const response = await fetch(url, { headers });

  if (!response.ok) throw new Error("Erro ao buscar exercício");
  return response.json();
}