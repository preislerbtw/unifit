// Sessão provisória (modo demonstração).
// Quando o login do back-end existir, o perfil virá da resposta dele (coluna
// "perfil" da tabela usuario) e este arquivo passa a guardar o que a API devolver.
const KEY = "unifit:session";

// alunos de demonstração (nível = difficulty da ExerciseDB)
export const DEMO_STUDENTS = [
  { userId: "aluno-1", name: "Antônio Enzo", level: "intermediate" },
  { userId: "aluno-2", name: "Maria Souza", level: "beginner" },
  { userId: "aluno-3", name: "João Lima", level: "advanced" },
];

// role: "aluno" | "professor" | "admin"
export function setSession(session) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
  sessionStorage.setItem("logado", "true");
}

export function getSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY));
    if (saved) return saved;
  } catch {
    // sessão corrompida: cai no padrão
  }
  // login antigo, sem perfil: trata como aluno
  return { role: "aluno", ...DEMO_STUDENTS[0] };
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem("logado");
}
