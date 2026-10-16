const API_URL = "http://localhost:3000";

// Cadastra um usuário de verdade no banco (tabela `usuario`).
// `dados` deve ter: nome, email, senha, matricula, curso, perfil,
// e opcionalmente data_nascimento, objetivo, nivel_experiencia.
export async function cadastrar(dados) {
  const response = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data_nascimento: null,
      objetivo: null,
      nivel_experiencia: null,
      ...dados,
    }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(resultado.message || "Erro ao cadastrar usuário.");
  }

  return resultado;
}

// Faz login contra o banco e devolve os dados do usuário (sem a senha).
export async function login(matricula, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula, senha }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(resultado.message || "Matrícula ou senha incorretos.");
  }

  return resultado.usuario;
}
