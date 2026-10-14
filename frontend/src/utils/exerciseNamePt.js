// Tradutor de nomes de exercícios (EN -> PT-BR) baseado em regras.
// Não usa API: monta "movimento + complementos + adjetivos + equipamento",
// com concordância de gênero (ex.: "Remada curvada", "Supino inclinado").
//
// Para corrigir/melhorar um nome específico, use OVERRIDES (no fim do arquivo).
// Para ensinar uma palavra nova, adicione uma linha nas listas abaixo.

const LEX = new Map();

// tipos: N = movimento (substantivo) | A = adjetivo/modificador | E = equipamento
//        B = parte do corpo ("de peito") | C = conector | X = ignorar
function add(type, rows) {
  for (const [keys, ...rest] of rows) {
    let entry;
    if (type === "N") entry = { t: "N", pt: rest[0], g: rest[1], def: rest[2] };
    else if (type === "O") entry = { t: "N", pt: rest[0], g: rest[1], obj: true }; // objeto/lugar (banco, chão...)
    else if (type === "A") entry = { t: "A", m: rest[0], f: rest[1] ?? rest[0], slot: rest[2] };
    else if (type === "C") entry = { t: "C", pt: rest[0], m: rest[1], f: rest[2] };
    else entry = { t: type, pt: rest[0] };
    keys.split("|").forEach((k) => LEX.set(k, entry));
  }
}

// ---------- movimentos: [chaves, português, gênero, adjetivo padrão] ----------
add("N", [
  ["bench press|chest press", "supino", "m", "reto"], // sem "inclinado/declinado" => reto
  ["shoulder press|overhead press|military press", "desenvolvimento", "m"],
  ["arnold press", "desenvolvimento Arnold", "m"],
  ["push press", "push press", "m"],
  ["leg press", "leg press", "m"],
  ["press", "press", "m"],
  ["back squat", "agachamento livre", "m"],
  ["hack squat", "agachamento hack", "m"],
  ["goblet squat", "agachamento goblet", "m"],
  ["sissy squat", "agachamento sissy", "m"],
  ["pistol squat", "agachamento pistola", "m"],
  ["jump squat", "agachamento com salto", "m"],
  ["split squat", "afundo", "m"],
  ["squat", "agachamento", "m"],
  ["wall sit", "agachamento isométrico na parede", "m"],
  ["lunge", "avanço", "m"],
  ["step up", "subida no degrau", "f"],
  ["deadlift", "levantamento terra", "m"],
  ["good morning", "good morning", "m"],
  ["hip thrust", "elevação pélvica", "f"],
  ["glute bridge", "ponte de glúteos", "f"],
  ["bridge", "ponte", "f"],
  ["pull up", "barra fixa", "f"],
  ["chin up", "barra fixa supinada", "f"],
  ["push up", "flexão de braços", "f"],
  ["sit up", "abdominal", "m"],
  ["v up", "abdominal em V", "m"],
  ["crunch", "abdominal", "m"],
  ["air bike", "abdominal bicicleta", "m"],
  ["hammer curl", "rosca martelo", "f"],
  ["preacher curl", "rosca Scott", "f"],
  ["concentration curl", "rosca concentrada", "f"],
  ["zottman curl", "rosca Zottman", "f"],
  ["wrist curl", "rosca de punho", "f"],
  ["seated leg curl", "cadeira flexora", "f"],
  ["lying leg curl|leg curl", "mesa flexora", "f"],
  ["leg extension", "cadeira extensora", "f"],
  ["curl", "rosca", "f"],
  ["raise", "elevação", "f"],
  ["upright row", "remada alta", "f"],
  ["t bar row", "remada cavalinho", "f"],
  ["row", "remada", "f"],
  ["pec deck fly|pec deck|butterfly", "voador", "m"],
  ["skull crusher", "tríceps testa", "m"],
  ["circles", "círculos", "m"],
  ["fly|flye", "crucifixo", "m"],
  ["back extension", "extensão lombar", "f"],
  ["hyperextension", "hiperextensão", "f"],
  ["extension", "extensão", "f"],
  ["lat pulldown", "puxada alta", "f"],
  ["pulldown", "puxada", "f"],
  ["triceps pushdown|pushdown", "extensão de tríceps", "f"],
  ["pullover|pull over", "pullover", "m"],
  ["shrug", "encolhimento de ombros", "m"],
  ["bench dip", "mergulho no banco", "m"],
  ["dip", "mergulho", "m"],
  ["kickback", "coice", "m"],
  ["kick", "chute", "m"],
  ["twist", "rotação", "f"],
  ["rotation", "rotação", "f"],
  ["bend", "inclinação", "f"],
  ["plank", "prancha", "f"],
  ["swing", "swing", "m"],
  ["clean", "clean", "m"],
  ["snatch", "arranco", "m"],
  ["jerk", "arremesso", "m"],
  ["thruster", "thruster", "m"],
  ["burpee", "burpee", "m"],
  ["mountain climber", "mountain climber", "m"],
  ["jumping jack", "polichinelo", "m"],
  ["box jump", "salto na caixa", "m"],
  ["jump rope", "pular corda", "m"],
  ["jump|hop", "salto", "m"],
  ["farmers walk", "caminhada do fazendeiro", "f"],
  ["bear crawl", "caminhada de urso", "f"],
  ["walk", "caminhada", "f"],
  ["run", "corrida", "f"],
  ["sprint", "sprint", "m"],
  ["march", "marcha", "f"],
  ["carry", "transporte", "m"],
  ["stretch", "alongamento", "m"],
  ["circle", "círculo", "m"],
  ["wheel rollout", "rolamento com roda abdominal", "m"],
  ["rollout|roll", "rolamento", "m"],
  ["crossover|cross over", "crossover", "m"],
  ["abduction", "abdução", "f"],
  ["adduction", "adução", "f"],
  ["flexion", "flexão", "f"],
  ["push", "empurrada", "f"],
  ["pull", "puxada", "f"],
  ["throw", "lançamento", "m"],
  ["toss", "arremesso", "m"],
  ["slam", "slam", "m"],
  ["hold", "isometria", "f"],
  ["crawl", "rastejada", "f"],
  ["scissor", "tesoura", "f"],
  ["superman", "superman", "m"],
  ["bird dog", "bird dog", "m"],
  ["dead bug", "dead bug", "m"],
  ["lift", "levantamento", "m"],
  ["reach", "alcance", "m"],
  ["elliptical machine|elliptical", "elíptico", "m"],
  ["stepmill machine|stepmill", "stepmill", "m"],
  ["skierg machine|skierg", "SkiErg", "m"],
  ["rowing machine", "remo ergométrico", "m"],
  ["battling rope", "corda naval", "f"],
  ["grip", "pegada", "f"],
  ["version", "versão", "f"],
]);

// ---------- objetos/lugares (nunca são o movimento principal) ----------
add("O", [
  ["bench", "banco", "m"],
  ["box", "caixa", "f"],
  ["step", "degrau", "m"],
  ["wall", "parede", "f"],
  ["floor", "chão", "m"],
  ["ball", "bola", "f"],
  ["ladder|stairs", "escada", "f"],
  ["chair", "cadeira", "f"],
  ["stationary bike", "bicicleta ergométrica", "f"],
  ["bike", "bicicleta", "f"],
  ["treadmill", "esteira", "f"],
]);

// ---------- adjetivos: [chaves, masculino, feminino (omitir = invariável)] ----------
add("A", [
  ["incline", "inclinado", "inclinada", "incl"],
  ["decline", "declinado", "declinada", "incl"],
  ["flat", "reto", "reta", "incl"],
  ["seated|sitting", "sentado", "sentada"],
  ["standing", "em pé"],
  ["lying|lying down", "deitado", "deitada"],
  ["prone", "de bruços"],
  ["kneeling", "ajoelhado", "ajoelhada"],
  ["hanging", "suspenso", "suspensa"],
  ["reverse", "inverso", "inversa"],
  ["inverted", "invertido", "invertida"],
  ["alternate|alternating", "alternado", "alternada"],
  ["lateral|side", "lateral"],
  ["front", "frontal"],
  ["rear", "posterior"],
  ["bent over", "curvado", "curvada"],
  ["bent", "flexionado", "flexionada"],
  ["straight arm", "com braços estendidos"],
  ["straight leg", "com pernas estendidas"],
  ["stiff leg|stiff legged", "stiff"],
  ["straight", "reto", "reta"],
  ["romanian", "romeno", "romena"],
  ["sumo", "sumô"],
  ["bulgarian", "búlgaro", "búlgara"],
  ["russian", "russo", "russa"],
  ["full", "completo", "completa"],
  ["partial", "parcial"],
  ["overhead", "acima da cabeça"],
  ["assisted", "assistido", "assistida"],
  ["weighted", "com peso"],
  ["close grip|narrow grip", "pegada fechada"],
  ["wide grip", "pegada aberta"],
  ["reverse grip|underhand grip|supinated grip", "pegada invertida"],
  ["overhand grip|pronated grip", "pegada pronada"],
  ["neutral grip", "pegada neutra"],
  ["parallel grip", "pegada paralela"],
  ["single leg|one leg|single arm|one arm|unilateral", "unilateral"],
  ["wide", "aberto", "aberta"],
  ["narrow|close", "fechado", "fechada"],
  ["cross body|crossbody", "cruzado", "cruzada"],
  ["short", "curto", "curta"],
  ["long", "longo", "longa"],
  ["high", "alto", "alta"],
  ["low", "baixo", "baixa"],
  ["inner", "interno", "interna"],
  ["outer", "externo", "externa"],
  ["isometric", "isométrico", "isométrica"],
  ["explosive", "explosivo", "explosiva"],
  ["static", "estático", "estática"],
  ["dynamic", "dinâmico", "dinâmica"],
  ["slow", "lento", "lenta"],
  ["double", "duplo", "dupla"],
  ["elevated", "elevado", "elevada"],
  ["supported", "apoiado", "apoiada"],
  ["neutral", "neutro", "neutra"],
  ["chest supported", "com apoio no peito"],
  ["diamond", "diamante"],
  ["archer", "arqueiro"],
  ["clap|clapping", "com palmas"],
  ["spider man|spiderman", "homem-aranha"],
  ["pike", "pike"],
  ["hindu", "hindu"],
  ["walking", "caminhando"],
  ["running", "correndo"],
  ["jumping", "com salto"],
  ["twisting|rotating", "com rotação"],
  ["bicycle", "bicicleta"],
  ["up", "para cima"],
  ["down", "para baixo"],
  ["out", "para fora"],
  ["backward|backwards", "para trás"],
  ["forward", "para frente"],
  ["behind the neck|behind neck", "atrás da nuca"],
  ["behind the head|behind head", "atrás da cabeça"],
  ["behind the back|behind back", "atrás das costas"],
]);

// ---------- equipamentos (já com a preposição) ----------
add("E", [
  ["barbell", "com barra"],
  ["olympic barbell", "com barra olímpica"],
  ["ez barbell|ez bar|ez", "com barra W"],
  ["trap bar|hex bar", "com barra hexagonal"],
  ["v bar", "com barra V"],
  ["t bar", "com barra T"],
  ["smith machine|smith", "no Smith"],
  ["dumbbell|dumbell", "com halteres"],
  ["kettlebell", "com kettlebell"],
  ["cable", "na polia"],
  ["lever|leverage machine|lever machine|machine", "na máquina"],
  ["sled machine|sled", "no sled"],
  ["hammer", "na máquina Hammer"],
  ["band|resistance band|elastic band", "com elástico"],
  ["medicine ball", "com bola medicinal"],
  ["stability ball|swiss ball|exercise ball", "na bola suíça"],
  ["bosu ball|bosu", "no Bosu"],
  ["rope", "com corda"],
  ["roller|foam roller", "com rolo"],
  ["wheel roller|ab wheel|wheel", "com roda abdominal"],
  ["tire", "com pneu"],
  ["suspension|trx", "no TRX"],
  ["plate|weight plate", "com anilha"],
  ["towel", "com toalha"],
  ["sandbag", "com saco de areia"],
  ["upper body ergometer", "no ergômetro de braços"],
  ["body weight|bodyweight", ""], // peso corporal: não aparece no nome
]);

// ---------- parte do corpo (vira "de peito", "de joelhos"...) ----------
add("B", [
  ["chest", "peito"],
  ["back", "costas"],
  ["upper back", "costas superiores"],
  ["lower back", "lombar"],
  ["shoulder|shoulders", "ombros"],
  ["biceps|bicep", "bíceps"],
  ["triceps|tricep", "tríceps"],
  ["forearm|forearms", "antebraços"],
  ["wrist", "punho"],
  ["leg|legs", "pernas"],
  ["thigh|thighs", "coxas"],
  ["calf|calves", "panturrilhas"],
  ["glute|glutes", "glúteos"],
  ["hip|hips", "quadril"],
  ["knee|knees", "joelhos"],
  ["ankle|ankles", "tornozelos"],
  ["foot|feet", "pés"],
  ["neck", "pescoço"],
  ["head", "cabeça"],
  ["arm|arms", "braços"],
  ["abs|ab", "abdômen"],
  ["core", "core"],
  ["lat|lats", "dorsais"],
  ["delt|delts|deltoid", "deltoides"],
  ["rear delt|rear deltoid", "deltoide posterior"],
  ["trap|traps|trapezius", "trapézio"],
  ["torso", "tronco"],
  ["waist", "cintura"],
  ["finger|fingers", "dedos"],
  ["hand|hands", "mãos"],
  ["spine", "coluna"],
  ["pec|pecs|pectoral", "peitoral"],
  ["quad|quads", "quadríceps"],
  ["hamstring|hamstrings", "posteriores de coxa"],
  ["oblique|obliques", "oblíquos"],
  ["heel|heels", "calcanhares"],
  ["toe|toes", "dedos dos pés"],
]);

// ---------- conectores: [chaves, neutro, masculino, feminino] ----------
add("C", [
  ["with", "com"],
  ["on", "em", "no", "na"],
  ["to", "para"],
  ["and", "e"],
  ["over", "sobre"],
  ["between", "entre"],
  ["behind", "atrás de"],
  ["from", "a partir de"],
  ["in", "em"],
  ["off", "fora de"],
  ["against", "contra"],
  ["of", "de"],
  ["for", "para"],
  ["at", "em"],
  ["under", "sob"],
  ["near", "perto de"],
  ["or", "ou"],
]);

add("X", [["the|a|an", ""]]);

// ---------- correções manuais (nome em inglês em minúsculas -> nome final) ----------
export const OVERRIDES = {
  // "3/4 sit-up": "Abdominal 3/4",
};

// palavras que não estavam no dicionário (para você completar em modo dev)
export const palavrasDesconhecidas = new Map();

function lookup(token) {
  const direct = LEX.get(token);
  if (direct) return direct;
  if (token.endsWith("es")) {
    const e = LEX.get(token.slice(0, -2));
    if (e) return e;
  }
  if (token.endsWith("s")) {
    const e = LEX.get(token.slice(0, -1));
    if (e) return e;
  }
  return null;
}

function parse(tokens, unknown) {
  const items = [];
  let i = 0;
  while (i < tokens.length) {
    let found = null;
    let len = 1;
    for (let l = Math.min(4, tokens.length - i); l >= 1; l--) {
      const key = tokens.slice(i, i + l).join(" ");
      const e = l === 1 ? lookup(key) : LEX.get(key);
      if (e) {
        found = e;
        len = l;
        break;
      }
    }
    if (!found) {
      const tok = tokens[i];
      if (!/\d/.test(tok)) unknown.push(tok);
      found = { t: "R", pt: tok };
    }
    if (found.t !== "X") items.push(found);
    i += len;
  }
  return items;
}

function buildSegment(items, fallbackGender) {
  const nouns = items.filter((e) => e.t === "N");
  const movs = nouns.filter((n) => !n.obj);
  const head = movs.length ? movs[movs.length - 1] : nouns[nouns.length - 1];
  const gender = head ? head.g : fallbackGender;
  const out = [];

  if (head) out.push(head.pt);
  nouns
    .filter((n) => n !== head)
    .forEach((n) => out.push(n.obj ? `${n.g === "f" ? "na" : "no"} ${n.pt}` : `de ${n.pt}`));
  items.filter((e) => e.t === "B").forEach((b) => out.push(head ? `de ${b.pt}` : b.pt));

  const adjs = items.filter((e) => e.t === "A" || e.t === "R");
  if (head?.def && !adjs.some((a) => a.slot === "incl")) out.push(head.def);
  // em português o adjetivo mais próximo do substantivo vem primeiro
  [...adjs].reverse().forEach((a) => out.push(a.t === "R" ? a.pt : gender === "f" ? a.f : a.m));

  const equips = [...new Set(items.filter((e) => e.t === "E").map((e) => e.pt))].filter(Boolean);
  if (equips.length) out.push(equips.join(" e "));

  const onlyEquip = !head && !adjs.length && !items.some((e) => e.t === "B");
  return { text: out.join(" "), gender, hasHead: !!head, onlyEquip };
}

function translateCore(text, fallbackGender, unknown) {
  const tokens = text.split(" ").filter(Boolean);
  const items = parse(tokens, unknown);

  const segments = [[]];
  const conns = [];
  for (const it of items) {
    if (it.t === "C") {
      conns.push(it);
      segments.push([]);
    } else segments[segments.length - 1].push(it);
  }

  const parts = [];
  let gender = fallbackGender;
  segments.forEach((seg, k) => {
    const built = buildSegment(seg, fallbackGender);
    if (k === 0) gender = built.gender;
    if (k > 0) {
      const c = conns[k - 1];
      if (!built.text) return;
      if (!built.onlyEquip) {
        parts.push(built.hasHead && c.m ? (built.gender === "f" ? c.f : c.m) : c.pt);
      }
    }
    if (built.text) parts.push(built.text);
  });
  return { text: parts.join(" "), gender };
}

const cache = new Map();

// Retorna { pt, completo }. "completo" = false se sobrou palavra sem tradução.
export function traduzirNomeExercicio(nameEn) {
  if (!nameEn) return { pt: nameEn, completo: false };
  if (cache.has(nameEn)) return cache.get(nameEn);

  const lower = String(nameEn).toLowerCase().trim();
  if (OVERRIDES[lower]) {
    const r = { pt: OVERRIDES[lower], completo: true };
    cache.set(nameEn, r);
    return r;
  }

  const unknown = [];
  const parens = [...lower.matchAll(/\(([^)]*)\)/g)].map((m) => m[1]);
  const clean = (s) =>
    s
      .replace(/\([^)]*\)/g, " ")
      .replace(/&/g, " and ")
      .replace(/['’]/g, "")
      .replace(/[-,]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const main = translateCore(clean(lower), "m", unknown);
  let pt = main.text;
  for (const p of parens) {
    const inner = translateCore(clean(p), main.gender, unknown).text;
    if (inner) pt += ` (${inner})`;
  }
  pt = pt.replace(/\s+/g, " ").trim();
  pt = pt.charAt(0).toUpperCase() + pt.slice(1);

  unknown.forEach((w) => palavrasDesconhecidas.set(w, (palavrasDesconhecidas.get(w) ?? 0) + 1));
  const result = { pt, completo: unknown.length === 0 };
  cache.set(nameEn, result);
  return result;
}