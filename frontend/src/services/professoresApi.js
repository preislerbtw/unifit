// dados mockados - quando o backend for implementado, trocar o corpo das funções
// por chamadas fetch para a API, por exemplo: fetch("/api/professores").
const professores = [
  {
    id: 1,
    nome: "Prof. Carlos Mendes",
    especialidade: "Musculação",
    academia: "Academia Unifor",
    bio: "Foco em hipertrofia e acompanhamento de iniciantes.",
  },
  {
    id: 2,
    nome: "Prof. Lucas Oliveira",
    especialidade: "Avaliação física",
    academia: "Academia Unifor",
    bio: "Avaliações posturais e de composição corporal.",
  },
  {
    id: 3,
    nome: "Prof. Rafael Souza",
    especialidade: "Treinamento funcional",
    academia: "Academia Unifor",
    bio: "Condicionamento, mobilidade e prevenção de lesões.",
  },
  {
    id: 4,
    nome: "Prof. Ana Luiza Costa",
    especialidade: "Emagrecimento",
    academia: "Academia Unifor",
    bio: "Planejamento de treino para perda de gordura e saúde.",
  },
];

export async function listarProfessores() {
  return professores;
}

const API_URL = "http://localhost:3000";

// professores que o aluno adicionou pelo código (vem do banco)
export async function listarMeusProfessores(idUsuario) {
  const response = await fetch(`${API_URL}/alunos/${idUsuario}/professores`);
  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(resultado.message || "Não foi possível carregar os professores.");
  }

  return resultado;
}

// vincula o aluno ao professor dono do código. Devolve o professor.
export async function adicionarProfessor(idUsuario, codigo) {
  const response = await fetch(`${API_URL}/alunos/${idUsuario}/professores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(resultado.message || "Não foi possível adicionar o professor.");
  }

  return resultado.professor;
}

export async function criarAgendamento(dados) {
  console.log("Agendamento criado (simulado):", dados);
  return { ok: true };
}