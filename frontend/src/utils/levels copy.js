// níveis usados pela ExerciseDB (difficulty) e pelo perfil do aluno
export const LEVELS = ["beginner", "intermediate", "advanced"];

const LABEL = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export function levelLabel(level) {
  return LABEL[level] ?? "Não informado";
}

// 0 = iniciante, 1 = intermediário, 2 = avançado
export function levelRank(level) {
  const i = LEVELS.indexOf(level);
  return i === -1 ? 0 : i;
}
