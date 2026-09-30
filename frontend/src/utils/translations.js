const bodyParts = {
  chest: "Peitoral",
  back: "Costas",
  shoulders: "Ombros",
  "upper arms": "Braços",
  "lower arms": "Antebraços",
  "upper legs": "Coxas",
  "lower legs": "Panturrilhas",
  waist: "Abdômen",
  cardio: "Cardio",
  neck: "Pescoço",
};

const equipments = {
  assisted: "Assistido",
  band: "Elástico",
  barbell: "Barra",
  "body weight": "Peso corporal",
  "bosu ball": "Bosu",
  cable: "Cabo",
  dumbbell: "Halter",
  "elliptical machine": "Elíptico",
  "ez barbell": "Barra W",
  hammer: "Martelo",
  kettlebell: "Kettlebell",
  "leverage machine": "Máquina",
  "medicine ball": "Bola medicinal",
  "olympic barbell": "Barra olímpica",
  "resistance band": "Elástico de resistência",
  roller: "Rolo",
  rope: "Corda",
  "skierg machine": "SkiErg",
  "sled machine": "Máquina (sled)",
  "smith machine": "Smith",
  "stability ball": "Bola suíça",
  "stationary bike": "Bicicleta ergométrica",
  "stepmill machine": "Stepmill",
  tire: "Pneu",
  "trap bar": "Barra hexagonal",
  "upper body ergometer": "Ergômetro de braços",
  weighted: "Com peso",
  "wheel roller": "Roda abdominal",
};

const levels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const muscles = {
  abductors: "Abdutores",
  abs: "Abdominais",
  adductors: "Adutores",
  biceps: "Bíceps",
  calves: "Panturrilhas",
  "cardiovascular system": "Sistema cardiovascular",
  delts: "Deltoides",
  forearms: "Antebraços",
  glutes: "Glúteos",
  hamstrings: "Posteriores de coxa",
  lats: "Dorsais",
  "levator scapulae": "Elevador da escápula",
  pectorals: "Peitorais",
  quads: "Quadríceps",
  "serratus anterior": "Serrátil anterior",
  "spinal erector": "Eretores da espinha",
  spine: "Coluna",
  traps: "Trapézio",
  triceps: "Tríceps",
  "upper back": "Parte superior das costas",
  shoulders: "Ombros",
  core: "Core",
  chest: "Peitoral",
  back: "Costas",
  hips: "Quadris",
  legs: "Pernas",
  arms: "Braços",
  neck: "Pescoço",
};

// usados só para montar o nome do exercício (não precisam de export)
const withEquip = {
  barbell: "com barra",
  dumbbell: "com halteres",
  cable: "no cabo",
  kettlebell: "com kettlebell",
  "smith machine": "no Smith",
  "ez barbell": "com barra W",
  "olympic barbell": "com barra olímpica",
  "trap bar": "com barra hexagonal",
  "leverage machine": "na máquina",
  "sled machine": "na máquina sled",
  band: "com elástico",
  "resistance band": "com elástico",
  "medicine ball": "com bola medicinal",
  "stability ball": "na bola suíça",
  "body weight": "",
  assisted: "assistido",
  weighted: "com peso",
};

const movements = {
  "bench press": "supino reto",
  "incline bench press": "supino inclinado",
  "decline bench press": "supino declinado",
  squat: "agachamento",
  "front squat": "agachamento frontal",
  deadlift: "levantamento terra",
  "romanian deadlift": "levantamento terra romeno",
  curl: "rosca",
  "biceps curl": "rosca bíceps",
  "hammer curl": "rosca martelo",
  fly: "crucifixo",
  "lateral raise": "elevação lateral",
  "front raise": "elevação frontal",
  "shoulder press": "desenvolvimento",
  row: "remada",
  "bent over row": "remada curvada",
  lunge: "avanço",
  "pull up": "barra fixa",
  "push up": "flexão",
  "triceps extension": "extensão de tríceps",
  "triceps pushdown": "tríceps na polia",
  crunch: "abdominal",
  plank: "prancha",
  // adicione conforme for encontrando
};

const translate = (map, value) =>
  map[String(value || "").toLowerCase()] || value;

export const trBodyPart = (v) => translate(bodyParts, v);
export const trEquipment = (v) => translate(equipments, v);
export const trLevel = (v) => translate(levels, v);
export const trMuscle = (v) => translate(muscles, v);

// traduz o nome do exercício por padrão: equipamento + movimento
export function trExerciseName(name) {
  if (!name) return name;
  const lower = name.trim().toLowerCase();
  const equips = Object.keys(withEquip).sort((a, b) => b.length - a.length);

  // equipamento no início: "barbell bench press"
  let equip = equips.find((e) => lower.startsWith(e + " "));
  let rest = equip ? lower.slice(equip.length + 1) : lower;

  // equipamento no fim: "bench press barbell"
  if (!equip) {
    equip = equips.find((e) => lower.endsWith(" " + e));
    if (equip) rest = lower.slice(0, lower.length - equip.length - 1);
  }

  const move = movements[rest];
  console.log("nome:", lower, "| equip:", equip, "| movimento:", rest, "| achou:", !!move);
  if (!move) return null;

  const suffix = equip ? withEquip[equip] : "";
  const result = `${move} ${suffix}`.trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// tradução de texto livre com cache no localStorage
export async function translateText(text, { isName = false } = {}) {
  if (!text) return text;

  if (isName) {
    const local = trExerciseName(text);
    if (local) return local;
  }

  const key = `tr:v2:${text}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch {
    // localStorage indisponível? segue sem cache
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|pt-BR`; // api pra traduzir
    const res = await fetch(url);
    const data = await res.json();
    const result = data?.responseData?.translatedText;

    const bad =
      !result ||
      result.toUpperCase().includes("MYMEMORY WARNING") ||
      result.toLowerCase() === text.toLowerCase();

    if (data?.responseStatus === 200 && !bad) {
      try {
        localStorage.setItem(key, result);
      } catch {
        // ignora
      }
      return result;
    }
  } catch (err) {
    console.error("Erro ao traduzir:", err);
  }
  return text;
}