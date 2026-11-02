const { GoogleGenAI } = require("@google/genai");
const AppError = require("../errors/AppError");

// modelo principal e de reserva (ajustáveis pelo .env)
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";
const MODELOS = [...new Set([MODEL, FALLBACK_MODEL])]; // evita repetir se forem iguais

const TENTATIVAS_POR_MODELO = 2;
const ESPERA_BASE_MS = 500; // 500ms, depois 1000ms
const MAX_HISTORICO = 20; // últimas mensagens enviadas para a IA
const MAX_CHARS = 2000; // limite por mensagem

const SYSTEM_PROMPT = `Você é o assistente virtual do UniFit, o app da academia da UNIFOR.
Responda sempre em português do Brasil, de forma curta, clara e amigável.
Ajude com dúvidas sobre exercícios, execução, grupos musculares, equipamentos e organização de treino.
Você não substitui os professores: para lesões, dores, doenças ou dúvidas de saúde, oriente o aluno a falar com um professor ou profissional de saúde.
Não invente informações sobre horários, fichas ou dados do aluno que você não recebeu.`;

let client = null;

// cria o client só na primeira chamada, para o dotenv já ter carregado o .env
function getClient() {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// erros temporários do lado do Google, que valem uma nova tentativa
function ehTemporario(err) {
  return [500, 503, 504].includes(err?.status);
}

// tenta o mesmo modelo algumas vezes antes de desistir dele
async function gerarComRetry(params) {
  for (let i = 0; i < TENTATIVAS_POR_MODELO; i++) {
    try {
      return await getClient().models.generateContent(params);
    } catch (err) {
      const ultima = i === TENTATIVAS_POR_MODELO - 1;
      if (!ehTemporario(err) || ultima) throw err;
      await esperar(ESPERA_BASE_MS * 2 ** i);
    }
  }
}

// percorre os modelos na ordem até algum responder
async function gerarComFallback(paramsBase) {
  let ultimoErro;
  for (const model of MODELOS) {
    try {
      return await gerarComRetry({ ...paramsBase, model });
    } catch (err) {
      ultimoErro = err;
      console.error(`Falha no modelo ${model} (status ${err?.status}):`, err?.message);
      // erro de requisição (400, 401, 403...) não adianta trocar de modelo
      if (![429, 500, 503, 504].includes(err?.status)) break;
    }
  }
  throw ultimoErro;
}

async function responder(historico) {
  if (!Array.isArray(historico) || historico.length === 0) {
    throw new AppError(400, "Envie o histórico da conversa.");
  }

  const mensagens = historico
    .slice(-MAX_HISTORICO)
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_CHARS),
    }));

  // a conversa precisa começar e terminar com uma mensagem do usuário
  while (mensagens.length && mensagens[0].role !== "user") mensagens.shift();
  if (!mensagens.length || mensagens[mensagens.length - 1].role !== "user") {
    throw new AppError(400, "A última mensagem precisa ser do usuário.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new AppError(500, "GEMINI_API_KEY não configurada no servidor.");
  }

  // o gemini chama o papel da IA de "model" em vez de "assistant"
  const contents = mensagens.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const resposta = await gerarComFallback({
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 800,
      },
    });

    return resposta.text ?? "";
  } catch (err) {
    console.error("========== ERRO GEMINI ==========");
    console.error("Mensagem:", err.message);
    console.error("Status:", err.status);
    console.error("Nome:", err.name);
    console.error("=================================");

    if (err?.status === 429) {
      throw new AppError(429, "Limite da IA atingido. Tente novamente em instantes.");
    }
    if (ehTemporario(err)) {
      throw new AppError(503, "A IA está sobrecarregada no momento. Tente novamente em instantes.");
    }
    throw new AppError(502, "Não foi possível falar com a IA agora.");
  }
}

module.exports = { responder };