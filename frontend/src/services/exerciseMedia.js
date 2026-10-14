// Imagens da free-exercise-db. Por padrão vêm do GitHub.
// Para servir do seu projeto (mais rápido e offline), copie a pasta "exercises"
// do repositório para frontend/public/exercises e troque a linha abaixo por:
//   const BASE = "/exercises/";
const BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

// Imagens suas (têm prioridade). Formato: id do exercício -> lista de caminhos
export const curatedImages = {
  // "Barbell_Bench_Press_-_Medium_Grip": ["/gifs/supino-0.jpg", "/gifs/supino-1.jpg"],
};

export function exerciseImages(exercicio) {
  if (curatedImages[exercicio.id]) return curatedImages[exercicio.id];
  return (exercicio.images ?? []).map((p) => BASE + p.split("/").map(encodeURIComponent).join("/"));
}