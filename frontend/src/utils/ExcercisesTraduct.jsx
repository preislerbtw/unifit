// traducao
const dicionario = {
  supino: "bench press",
  agachamento: "squat",
  levantamento: "deadlift",
  terra: "deadlift",
  rosca: "curl",
  remada: "row",
  puxada: "pulldown",
  desenvolvimento: "press",
  elevação: "raise",
  elevacao: "raise",
  extensão: "extension",
  extensao: "extension",
  flexão: "push up",
  flexao: "push up",
  abdominal: "crunch",
  panturrilha: "calf",
  perna: "leg",
  pernas: "leg",
  peito: "chest",
  costas: "back",
  ombro: "shoulder",
  ombros: "shoulder",
  triceps: "tricep",
  tríceps: "tricep",
  biceps: "bicep",
  bíceps: "bicep",
  gluteo: "glute",
  glúteo: "glute",
  prancha: "plank",
  barra: "barbell",
  halter: "dumbbell",
  máquina: "machine",
  maquina: "machine",
};

// export function traduzirTermoBusca(termo) {
//   const termoLower = termo.toLowerCase().trim();
//   if (!termoLower) return "";

//   // match exato primeiro
//   if (dicionario[termoLower]) return dicionario[termoLower];

//   // depois tenta achar a palavra dentro do que foi digitado
//   for (const chave in dicionario) {
//     if (termoLower.includes(chave)) return dicionario[chave];
//   }

//   // se não achar tradução, usa o termo original (cobre quem digita em inglês)
//   return termoLower;
// }

export function traduzirTermoBusca(termo) {
  const termoLower = termo.toLowerCase().trim();
  if (!termoLower) return "";

  // match exato primeiro
  if (dicionario[termoLower]) return dicionario[termoLower];

  // agora checa se a palavra-chave do dicionário COMEÇA com o que foi digitado
  // (ex: "supi" -> encontra "supino" -> traduz pra "bench press")
  for (const chave in dicionario) {
    if (chave.startsWith(termoLower) || termoLower.startsWith(chave)) {
      return dicionario[chave];
    }
  }

  // se não achar tradução, usa o termo original (cobre quem digita em inglês)
  return termoLower;
}