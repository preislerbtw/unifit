const KEY = "unifit:session";
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
  return { role: "aluno", ...DEMO_STUDENTS[0] };
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem("logado");
}

const ROLES = ["aluno", "professor", "admin"];
export function sessaoDeUsuario(usuario) {
  const perfil = String(usuario.perfil || "").trim().toLowerCase();
  return {
    role: ROLES.includes(perfil) ? perfil : "aluno",
    userId: String(usuario.id),
    idUsuario: usuario.id,
    professorId: usuario.professorId ?? null,
    name: usuario.nome,
    email: usuario.email,
    matricula: usuario.matricula,
    curso: usuario.curso,
    altura: usuario.altura,
    peso: usuario.peso,
    level: usuario.nivel_experiencia || undefined,
  };
}