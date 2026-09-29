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
  barbell: "Barra",
  dumbbell: "Halter",
  cable: "Cabo",
  "body weight": "Peso corporal",
  "leverage machine": "Máquina",
  "sled machine": "Máquina (sled)",
  "smith machine": "Smith",
  band: "Elástico",
  kettlebell: "Kettlebell",
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

const translate = (map, value) =>
  map[String(value || "").toLowerCase()] || value;

export const trBodyPart = (v) => translate(bodyParts, v);
export const trEquipment = (v) => translate(equipments, v);
export const trLevel = (v) => translate(levels, v);
export const trMuscle = (v) => translate(muscles, v);

// tradução de texto livre com cache no localStorage
export async function translateText(text) {
  if (!text) return text;

  const key = `tr:${text}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch {
    // localStorage indisponível? segue sem cache
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent( // api pra traduzir
      text
    )}&langpair=en|pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data?.responseData?.translatedText;

    if (data?.responseStatus === 200 && result) {
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