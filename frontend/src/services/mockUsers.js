export const staff_mock = {
    matricula: "prof1",
    senha: "123456",
    session: {
    role: "professor", // professor e admin acessam as mesmas rotas
    userId: "professor-1",
    professorId: 1,
    name: "Professor"
  },
}

export function autenticarEquipe(matricula, senha) {
  return matricula.trim() === staff_mock.matricula && senha === staff_mock.senha
    ? staff_mock.session
    : null;
}