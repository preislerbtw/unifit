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
    nome: "Profa. Ana Beatriz Lima",
    especialidade: "Avaliação física",
    academia: "Academia Unifor",
    bio: "Avaliações posturais e de composição corporal.",
  },
  {
    id: 3,
    nome: "Prof. Rafael Souza",
    especialidade: "Treinamento funcional",
    academia: "Academia Central",
    bio: "Condicionamento, mobilidade e prevenção de lesões.",
  },
  {
    id: 4,
    nome: "Profa. Marina Costa",
    especialidade: "Emagrecimento",
    academia: "Academia Central",
    bio: "Planejamento de treino para perda de gordura e saúde.",
  },
];

export async function listarProfessores() {
  return professores;
}

export async function criarAgendamento(dados) {
  console.log("Agendamento criado (simulado):", dados);
  return { ok: true };
}