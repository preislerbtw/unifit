// lista curada dos exercícios mais conhecidos, com nome em PT
// "match" é o termo usado pra encontrar o exercício correspondente na API (em inglês)
export const PopularExercises = [
  { pt: "Supino Reto", match: "barbell bench press" },
  { pt: "Supino Inclinado", match: "incline barbell bench press" },
  { pt: "Supino Declinado", match: "decline barbell bench press" },
  { pt: "Agachamento Livre", match: "barbell squat" },
  { pt: "Levantamento Terra", match: "barbell deadlift" },
  { pt: "Rosca Direta", match: "barbell curl" },
  { pt: "Rosca Alternada", match: "alternate dumbbell curl" },
  { pt: "Remada Curvada", match: "bent over barbell row" },
  { pt: "Remada Cavalinho", match: "t-bar row" },
  { pt: "Puxada Frontal", match: "lat pulldown" },
  { pt: "Desenvolvimento Militar", match: "military press" },
  { pt: "Elevação Lateral", match: "dumbbell lateral raise" },
  { pt: "Tríceps Testa", match: "lying triceps press" },
  { pt: "Tríceps Corda", match: "triceps pushdown" },
  { pt: "Prancha Abdominal", match: "plank" },
  { pt: "Abdominal Supra", match: "crunch" },
  { pt: "Flexão de Braço", match: "push-up" },
  { pt: "Leg Press", match: "leg press" },
  { pt: "Cadeira Extensora", match: "leg extension" },
  { pt: "Mesa Flexora", match: "lying leg curl" },
  { pt: "Panturrilha em Pé", match: "standing calf raise" },
  { pt: "Barra Fixa", match: "pull-up" },
  { pt: "Elevação de Quadril", match: "barbell glute bridge" },
  { pt: "Afundo", match: "barbell lunge" },
];

export function montarListaPopular(todosExercicios) {
  const resultado = [];
  for (const item of PopularExercises) {
    const encontrado = todosExercicios.find((ex) =>
      ex.name.toLowerCase().includes(item.match)
    );
    if (encontrado) {
      resultado.push({ ...encontrado, nomePt: item.pt });
    }
  }

  return resultado;
}