import { traduzirNomeExercicio } from "./exerciseNamePt";

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
  glutes: "Glúteos",
};

const equipments = {
  // free-exercise-db
  none: "Sem equipamento",
  other: "Outro",
  "body only": "Peso corporal",
  machine: "Máquina",
  kettlebells: "Kettlebell",
  bands: "Elástico",
  "exercise ball": "Bola suíça",
  "foam roll": "Rolo de espuma",
  "e-z curl bar": "Barra W",
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
  expert: "Avançado",
};

const muscles = {
  abdominals: "Abdominais",
  quadriceps: "Quadríceps",
  "lower back": "Lombar",
  "middle back": "Meio das costas",
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

const translate = (map, value) =>
  map[String(value || "").toLowerCase()] || value;

export const trBodyPart = (v) => translate(bodyParts, v);
export const trEquipment = (v) => translate(equipments, v);
export const trLevel = (v) => translate(levels, v);
export const trMuscle = (v) => translate(muscles, v);

// nome do exercício em português (null se ficou alguma palavra sem tradução)
export function trExerciseName(name) {
  const r = traduzirNomeExercicio(name);
  return r.completo ? r.pt : null;
}

// ---------- tradução de texto livre (passo a passo) ----------
const MYMEMORY_EMAIL = import.meta.env.VITE_MYMEMORY_EMAIL; // opcional: sobe a cota diária

function limpar(t) {
  return String(t)
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/^[\s•\-–*]+/, "") // tira "•" e "-" soltos no começo do passo
    .trim();
}

// Tradutor embutido do Chrome (gratuito e sem limite). Se não existir, retorna null.
let nativoPromise = null;
function getTradutorNativo() {
  if (typeof self === "undefined" || !("Translator" in self))
    return Promise.resolve(null);
  nativoPromise ??= (async () => {
    try {
      const opts = { sourceLanguage: "en", targetLanguage: "pt" };
      if ((await self.Translator.availability(opts)) === "unavailable")
        return null;
      return await self.Translator.create(opts);
    } catch {
      nativoPromise = null; // tenta de novo na próxima chamada
      return null;
    }
  })();
  return nativoPromise;
}

export async function translateText(text) {
  if (!text) return text;

  const key = `tr:v3:${text}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch {
    // localStorage indisponível? segue sem cache
  }

  const guardar = (valor) => {
    try {
      localStorage.setItem(key, valor);
    } catch {
      // ignora
    }
    return valor;
  };

  // 1) tradutor do navegador
  try {
    const nativo = await getTradutorNativo();
    if (nativo) {
      const r = limpar(await nativo.translate(text));
      if (r) return guardar(r);
    }
  } catch {
    // cai para a API
  }

  // 2) MyMemory (cota diária pequena sem e-mail)
  try {
    const params = new URLSearchParams({ q: text, langpair: "en|pt-BR" });
    if (MYMEMORY_EMAIL) params.set("de", MYMEMORY_EMAIL);
    const res = await fetch(
      `https://api.mymemory.translated.net/get?${params}`,
    );
    const data = await res.json();
    const result = data?.responseData?.translatedText;

    const ruim =
      !result ||
      result.toUpperCase().includes("MYMEMORY WARNING") ||
      result.toLowerCase() === text.toLowerCase();

    if (Number(data?.responseStatus) === 200 && !ruim)
      return guardar(limpar(result));
  } catch (err) {
    console.error("Erro ao traduzir:", err);
  }
  return limpar(text);
}
