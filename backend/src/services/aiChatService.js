const { GoogleGenAI } = require("@google/genai");
const AppError = require("../errors/AppError");

// confira o nome do modelo disponível para você no Google AI Studio
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
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
        m.content.trim()
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
    const resposta = await getClient().models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 800,
      },
    });

    return resposta.text ?? "";
  } catch (err) {
    console.error("Erro ao chamar a IA:", err);
    if (err?.status === 429) {
      throw new AppError(429, "Limite da IA atingido. Tente de novo em instantes.");
    }
    throw new AppError(502, "Não foi possível falar com a IA agora.");
  }
}

module.exports = { responder };