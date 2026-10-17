const API_URL = "http://localhost:3000";
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

// faz login contra o banco e devolve os dados do usuário (sem a senha).
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

// salva peso (kg) e altura (m) do usuário logado. Devolve { peso, altura }.
export async function atualizarMedidas(idUsuario, peso, altura) {
  const response = await fetch(`${API_URL}/perfil/medidas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUsuario, peso, altura }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    throw new Error(resultado.message || "Não foi possível salvar.");
  }

  if (resultado.peso == null || resultado.altura == null) {
    throw new Error(
      "O servidor não confirmou os dados. Reinicie o back-end (node server.js)."
    );
  }

  return { peso: resultado.peso, altura: resultado.altura };
}